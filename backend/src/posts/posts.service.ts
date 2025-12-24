import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private configService: ConfigService,
  ) { }

  private getFullImageUrl(imagePath: string | undefined): string | undefined {
    if (!imagePath) return undefined;
    if (imagePath.startsWith('http')) return imagePath;

    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:5000';
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  }

  private mapPost(post: any): any {
    if (!post) return null;
    const postObj = post.toObject ? post.toObject() : post;
    if (postObj.featuredImage) {
      postObj.featuredImage = this.getFullImageUrl(postObj.featuredImage);
    }
    return postObj;
  }

  async create(data: Partial<Post>): Promise<any> {
    const post = new this.postModel(data);
    const saved = await post.save();
    return this.mapPost(saved);
  }

  async findAllPublished(query: { q?: string; category?: string; page?: number; limit?: number }) {
    const { q, category, page = 1, limit = 10 } = query;
    const filter: any = { status: 'published' };

    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category && category !== '') {
      try {
        filter.category = new Types.ObjectId(category);
      } catch (e) {
        // If not a valid ObjectId, ignore the filter
      }
    }

    const skip = (page - 1) * limit;
    const posts = await this.postModel
      .find(filter)
      .populate('category')
      .populate('author', '-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.postModel.countDocuments(filter).exec();

    return {
      data: posts.map(p => this.mapPost(p)),
      meta: { total, page, limit }
    };
  }

  async findById(id: string) {
    const post = await this.postModel
      .findById(id)
      .populate('category')
      .populate('author', '-password')
      .exec();

    if (!post) throw new NotFoundException('Post not found');
    return this.mapPost(post);
  }

  async update(id: string, data: Partial<Post>, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    if (post.author.toString() !== userId) throw new ForbiddenException('Not allowed');

    const updated = await this.postModel.findByIdAndUpdate(id, data, { new: true })
      .populate('category')
      .populate('author', '-password')
      .exec();
    return this.mapPost(updated);
  }

  async remove(id: string, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    if (post.author.toString() !== userId) throw new ForbiddenException('Not allowed');

    return this.postModel.findByIdAndDelete(id).exec();
  }

  async listAll(page = 1, limit = 20) {
    const posts = await this.postModel
      .find()
      .populate('category')
      .populate('author', '-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return posts.map(p => this.mapPost(p));
  }
}