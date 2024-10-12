import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import {Document} from 'mongoose';

const SALT_WORK_FACTOR = 10;

export interface UserMethods{
  generateToken: () => void;
  checkPassword: (password: string) => Promise<boolean>;
}

export type UserDocument = User & Document & UserMethods;

@Schema()
export class User {
  @Prop({required: true, unique: true})
  username: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  token: string;

  @Prop({required: true , enum: ['user' , 'admin'] , default: 'user'})
  role:string
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function generateToken() {
  this.token = crypto.randomUUID();
}

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
}

UserSchema.pre<UserDocument>('save', async function (){
  if(!this.isModified('password')){
    return;
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password , salt)
})

UserSchema.set('toJSON', {
  transform: (_doc , ret) =>{
    delete ret.password;
    return ret;
  }
})