import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Error, Model } from 'mongoose';
import {Artist, ArtistDocument} from "../schemas/artist.schema";
import {InjectModel} from "@nestjs/mongoose";
import {ArtistCategoryDto} from "./artist-category.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import e from 'express';
import { extname } from 'path'
import { CheckAdminRight } from '../auth/checkAdminRight';
import { TokenAuthGuard } from '../auth/token-auth.guard';

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

    @UseGuards(TokenAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('photo' , {storage: diskStorage({
            destination: './public/images/artist',
            filename(req: e.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                callback(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async createArtist(@Body() artistDto: ArtistCategoryDto , @UploadedFile() file: Express.Multer.File) {
        return await this.artistModel.create({
            name: artistDto.name,
            info: artistDto.info,
            photo: file? 'images/' + file.filename : null,
        });
    }
    @UseGuards(CheckAdminRight)
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
