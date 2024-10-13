import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ArtistController} from './artist/artist.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Artist, ArtistSchema} from "./schemas/artist.schema";
import { AlbumController } from './album/album.controller';
import { Album, AlbumSchema } from './schemas/album.schema';
import { TrackController } from './track/track.controller';
import { Track, TrackSchema } from './schemas/tracks.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.strategy';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://127.0.0.1:27017/musicAPI'),
      MongooseModule.forFeature([
        {name: Artist.name , schema: ArtistSchema},
        {name: Album.name , schema: AlbumSchema},
        {name: Track.name , schema: TrackSchema},
        {name: User.name , schema: UserSchema},
      ]),
    PassportModule
  ],
  controllers: [AppController, ArtistController, AlbumController, TrackController, UsersController],
  providers: [AppService, AuthService , LocalStrategy],
})
export class AppModule {}
