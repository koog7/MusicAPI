import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import { Model } from 'mongoose';
import { TrackCategoryDto } from './track-category.dto';

@Controller('track')
export class TrackController {
    constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>) {
    }

    @Get()
    async getAll(){
        return this.trackModel.find()
    }

    @Post()
    async postTrack(@Body() trackDto: TrackCategoryDto){
        return await this.trackModel.create({
            title: trackDto.title,
            duration: trackDto.duration,
            albumId: trackDto.albumId,
            numberTrack: trackDto.numberTrack
        })
    }

    @Delete(':id')
    async deleteArtist(@Param('id') id:string){
      const findAlbum = await this.trackModel.findOne({_id:id});

      if(!findAlbum){
        return 'Cannot delete track';
      }
      await this.trackModel.findByIdAndDelete(findAlbum._id);
      return 'Successfully deleted track , id - ' + findAlbum._id;
    }
}
