import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {Model} from "mongoose";
import {Artist, ArtistDocument} from "../schemas/artist.schema";
import {InjectModel} from "@nestjs/mongoose";
import {ArtistCategoryDto} from "./artist-category.dto";

@Controller('artist')
export class ArtistController {
    constructor(
        @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>) {
    }

    @Get()
    async getAll(){
        return this.artistModel.find();
    }

    @Get(':id')
    async getOneById(@Param('id') id:string){
        return this.artistModel.findOne({_id:id});
    }

    @Post()
    async createArtist(@Body() artistDto: ArtistCategoryDto) {
        return await this.artistModel.create({
            name: artistDto.name,
            info: artistDto.info,
            photo: artistDto.photo,
        });
    }

    @Delete(':id')
    async deleteArtist(@Param('id') id:string){
        const findArtist = await this.artistModel.findOne({_id:id});

        if(!findArtist){
            return 'Cannot delete artist';
        }
        await this.artistModel.findByIdAndDelete(findArtist._id);
        return 'Successfully deleted artist , id - ' + findArtist._id;
    }
}
