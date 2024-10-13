import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async validateUser(username: string, password: string){
    const user = await this.userModel.findOne({ username });

    if(!user){
      return null;
    }

    const passwordCorrect = await user.checkPassword(password);

    if(!passwordCorrect){
      return null;
    }

    return user
  }
}
