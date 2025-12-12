import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(data: Partial<Post>): Promise<PostDocument> {
    const post = new this.postModel(data);
    return post.save();
  }

  async findAllPublished(query: { q?: string; category?: string; page?: number; limit?: number }) {
    const { q, category, page = 1, limit = 10 } = query;
    const filter: any = { status: 'published' };
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    const skip = (page - 1) * limit;
    const posts = await this.postModel.find(filter).populate('category').populate('author', '-password').skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
    const total = await this.postModel.countDocuments(filter).exec();
    return { data: posts, meta: { total, page, limit } };
  }

  async findById(id: string) {
    const post = await this.postModel.findById(id).populate('category').populate('author', '-password').exec();
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, data: Partial<Post>, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    if (post.author.toString() !== userId) throw new ForbiddenException('Not allowed');
    return this.postModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    if (post.author.toString() !== userId) throw new ForbiddenException('Not allowed');
    return this.postModel.findByIdAndDelete(id).exec();
  }

  // For admin, you may expose listAll that shows drafts too
  async listAll(page = 1, limit = 20) {
    return this.postModel.find().skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }).exec();
  }
}
