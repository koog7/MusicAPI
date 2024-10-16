import {
  Body,
  Controller,
  Delete,
  Get, HttpException, HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Error, Model } from 'mongoose';
import { AlbumCategoryDto } from './album-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import e from 'express';
import { extname } from 'path';
import { CheckAdminRight } from '../auth/checkAdminRight';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { Artist, ArtistDocument } from '../schemas/artist.schema';

@Controller('album')
export class AlbumController {
    constructor(
      @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
      @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>) {
    }

    @Get()
    async getAlbums(@Query('artistId') artistId?: string) {
        if (artistId) {
          return await this.albumModel.find({artistId}).exec();
        } else {
          return await this.albumModel.find().exec();
        }
    }

    @Get(':id')
    async getOneAlbum(@Param('id') id: string) {
        return this.albumModel.findOne({_id:id});
    }

    @UseGuards(TokenAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('photo' , {storage: diskStorage({
        destination: './public/images/album',
        filename(req: e.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
          callback(null, `${randomName}${extname(file.originalname)}`)
        }
      })
    }))
    async createArtist(@Body() albumDto: AlbumCategoryDto, @UploadedFile() file: Express.Multer.File) {
      return await this.albumModel.create({
          title: albumDto.title,
          artistId: albumDto.artistId,
          yearRelease: albumDto.yearRelease,
          photo: file? 'images/' + file.filename : null,
        });
    }
  @UseGuards(CheckAdminRight)
  @Delete(':id')
  async deleteArtist(@Param('id') id:string){
    const findAlbum = await this.albumModel.findOne({_id:id});

    if(!findAlbum){
      return 'Cannot delete album';
    }
    await this.albumModel.findByIdAndDelete(findAlbum._id);
    return 'Successfully deleted album , id - ' + findAlbum._id;
  }

}
