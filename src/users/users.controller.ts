import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { use } from 'passport';

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

  @UseGuards(TokenAuthGuard)
  @Post('secret')
  async secret(@Req() req: AuthRequest){
    const user = req.user as UserDocument;
    return {message:'success' , user: user.username}
  }
}
