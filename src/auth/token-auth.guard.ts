import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const getToken = request.get('Authorization');

    if(!getToken){
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const [, token] = getToken.split(' ');

    if(!token){
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userModel.findOne({token:token});

    if(!user){
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    request.user = user;

    return true;
  }
}
