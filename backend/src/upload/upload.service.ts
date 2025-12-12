import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async getFileUrl(filename: string) {
    return `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${filename}`;
  }
}
