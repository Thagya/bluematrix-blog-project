import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) { }

    async create(data: Partial<Category>): Promise<CategoryDocument> {
        const cat = new this.categoryModel(data);
        return cat.save();
    }

    async findAll(): Promise<CategoryDocument[]> {
        return this.categoryModel.find().exec();
    }

    async findById(id: string): Promise<CategoryDocument> {
        const cat = await this.categoryModel.findById(id).exec();
        if (!cat) throw new NotFoundException('Category not found');
        return cat;
    }

    async update(id: string, data: Partial<Category>): Promise<CategoryDocument> {
        const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updatedCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return updatedCategory;
    }

    async remove(id: string) {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
}
