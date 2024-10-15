import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    username: string;
    password: string;
    token: string;
    role: 'user' | 'admin';
  };
}

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel:Model<UserDocument>) {
  }

  @Post()
  async register(@Body() body: { username: string; password: string }){
    const user = new this.userModel({
      username: body.username,
      password: body.password
    })

    user.generateToken()

    return await user.save()
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: AuthRequest){
    return req.user
  }

  @Delete('sessions')
  async delete(@Req() req: Request){
    const getToken = req.get('Authorization');

    if(!getToken){
      return null;
    }

    const [, token] = getToken.split(' ')

    if(!token){
      return null;
    }

    const user = await this.userModel.findOne({token:token});

    if(!user){
      return null;
    }

    user.generateToken()

    await user.save();

    return { message: 'User logged out successfully' }
  }
}
