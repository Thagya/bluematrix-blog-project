import { Controller, Get, Post as HttpPost, Body, Param, Query, UseGuards, Req, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Types } from 'mongoose';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../upload';

@Controller('posts')
export class PostsController {
    constructor(private ps: PostsService) { }

    @Get()
    listPublic(@Query() query: any) {
        return this.ps.findAllPublished(query);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.ps.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @HttpPost()
    @UseInterceptors(FileInterceptor('featuredImage', multerOptions))
    async create(@Body() dto: CreatePostDto, @GetUser('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
        const imageUrl = file ? `/uploads/${file.filename}` : dto.featuredImage;
        return this.ps.create({ ...dto, author: new Types.ObjectId(userId), category: new Types.ObjectId(dto.category), featuredImage: imageUrl });
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('featuredImage', multerOptions))
    async update(
        @Param('id') id: string,
        @Body() dto: UpdatePostDto,
        @GetUser('userId') userId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        const updateData: any = { ...dto };
        if (file) {
            updateData.featuredImage = `/uploads/${file.filename}`;
        }
        if (dto.category) {
            updateData.category = new Types.ObjectId(dto.category);
        }
        return this.ps.update(id, updateData, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @GetUser('userId') userId: string) {
        return this.ps.remove(id, userId);
    }
}
