import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer-config';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('uploads')
export class UploadController {
    constructor(private uploadService: UploadService) { }

    // You may allow public uploads or protect it with JwtAuthGuard
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async upload(@UploadedFile() file: Express.Multer.File) {
        return {
            filename: file.filename,
            url: await this.uploadService.getFileUrl(file.filename),
            originalname: file.originalname,
            size: file.size,
        };
    }
}
