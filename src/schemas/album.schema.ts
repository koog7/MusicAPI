import { Document , Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true , type: Types.ObjectId, ref: 'Artist'})
  artistId: Types.ObjectId;

  @Prop({ required: true })
  yearRelease: number;

  @Prop({ required: true })
  photo: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);