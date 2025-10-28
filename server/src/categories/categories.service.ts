import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) {}

    create(createCategoryDto: CreateCategoryDto) {
        try {
            const { category_name } = createCategoryDto;
            const result = this.categoryModel.create({
                category_name
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    async findAll() {
        return await this.categoryModel.find();
    }

    async findOne(id: string | mongoose.Types.ObjectId) {
        return await this.categoryModel.findById(id);
    }

    // update(id: number, updateCategoryDto: UpdateCategoryDto) {
    //   return `This action updates a #${id} category`;
    // }

    // remove(id: number) {
    //   return `This action removes a #${id} category`;
    // }
}
