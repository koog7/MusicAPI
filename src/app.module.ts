import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ArtistController} from './artist/artist.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Artist, ArtistSchema} from "./schemas/artist.schema";
import { AlbumController } from './album/album.controller';
import { Album, AlbumSchema } from './schemas/album.schema';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://127.0.0.1:27017/musicAPI'),
      MongooseModule.forFeature([
        {name: Artist.name , schema: ArtistSchema},
        {name: Album.name , schema: AlbumSchema},
      ])
  ],
  controllers: [AppController, ArtistController, AlbumController],
  providers: [AppService],
})
export class AppModule {}
