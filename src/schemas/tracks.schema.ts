import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({required: true})
  title: string;

  @Prop({required: true})
  duration: string;

  @Prop({ required: true , type: mongoose.Schema.Types.ObjectId, ref: 'Album'})
  albumId: Types.ObjectId;

  @Prop({ required: true })
  numberTrack: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);