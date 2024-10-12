import { Body, Controller, Post, Req } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

}
