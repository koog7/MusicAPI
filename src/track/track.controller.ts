import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import { Model } from 'mongoose';
import { TrackCategoryDto } from './track-category.dto';
import { CheckAdminRight } from '../auth/checkAdminRight';

@Controller('track')
export class TrackController {
    constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>) {
    }

    @Get()
    async getAll(@Query('albumId') albumId?: string){
        if(albumId){
            return await this.trackModel.find({albumId}).exec();
        }else{
            return this.trackModel.find().exec();
        }
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
    @UseGuards(CheckAdminRight)
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
