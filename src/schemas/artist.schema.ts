import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    info: string;

    @Prop({ required: true })
    photo: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);