import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CategoriesService } from './../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';

interface ProductFilterOptions {
    categoryId?: string | mongoose.Types.ObjectId;
    ids?: string[];
}

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        private readonly categoriesService: CategoriesService
    ) {}

    async create(createProductDto: CreateProductDto) {
        const result = await this.productModel.create(createProductDto);
        return result;
    }

    // Just for testing now
    // After that, use it for bulk insert by admin
    async createBulk(createProductDtos: CreateProductDto[]) {
        try {
            const result = await this.productModel.insertMany(
                createProductDtos
            );
            return result;
        } catch (error) {
            throw new Error('Error inserting products: ' + error.message);
        }
    }

    // async findMany(): Promise<any[]>;
    // async findMany(filter: ProductFilterOptions): Promise<any[]>;
    // async findMany(filter?: ProductFilterOptions): Promise<any[]> {
    //     let MongooseQuery: any = {};

    //     if (!filter || Object.keys(filter).length === 0) {
    //         MongooseQuery = {};
    //     } else {
    //         if (filter.categoryId) {
    //             MongooseQuery.category_id = filter.categoryId;
    //         }
    //         if (filter.ids) {
    //             MongooseQuery._id = { $in: filter.ids };
    //         }
    //     }
    //     console.log('MongooseQuery:', MongooseQuery);

    //     const productDataList = await this.productModel
    //         .find(MongooseQuery)
    //         .exec();
    //     const productShowList = await this.#getProductShowList(productDataList);
    //     return _.shuffle(productShowList);
    // }

    async findAll() {
        const productDataList = await this.productModel.find().exec();
        const productShowListPromises = productDataList.map(async (product) => {
            const category = await this.categoriesService.findOne(
                product.category_id
            );
            const category_name = category.category_name;

            return {
                id: product._id,
                name: product.name,
                category: category_name,
                description: product.description,
                price: product.price,
                image_url: product.image_url
            };
        });

        // Wait for all promises to resolve
        const resolvedProductShowList = await Promise.all(
            productShowListPromises
        );

        return resolvedProductShowList;
    }

    async findByCategoryId(category_id: string | mongoose.Types.ObjectId) {
        const category = await this.categoriesService.findOne(category_id);
        const category_name = category.category_name;
        const productDataList = await this.productModel
            .find({ category_id })
            .exec();

        const productShowListPromises = productDataList.map(async (product) => {
            return {
                id: product._id,
                name: product.name,
                category: category_name,
                description: product.description,
                price: product.price,
                image_url: product.image_url
            };
        });
        // Wait for all promises to resolve
        const resolvedProductShowList = await Promise.all(
            productShowListPromises
        );

        return resolvedProductShowList;
    }

    async findManyByIds(ids: string[]) {
        const productDataList = await this.productModel
            .find({ _id: { $in: ids } })
            .exec();

        const productShowListPromises = productDataList.map(async (product) => {
            const category = await this.categoriesService.findOne(
                product.category_id
            );
            const category_name = category.category_name;
            return {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                image_url: product.image_url,
                category: category_name
            };
        });
        // Wait for all promises to resolve
        const resolvedProductShowList = await Promise.all(
            productShowListPromises
        );

        return resolvedProductShowList;
    }

    async findOneByIdWithCategoryName(id: string | mongoose.Types.ObjectId) {
        try {
            const product = await this.productModel.findOne({ _id: id });
            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }

            if (product.category_id) {
                try {
                    const category = await this.categoriesService.findOne(
                        product.category_id
                    );
                    const category_name = category.category_name;
                    return {
                        id: product._id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image_url: product.image_url,
                        category: category_name
                    };
                } catch (error) {
                    throw new NotFoundException(
                        `Category with ID ${product.category_id} not found`
                    );
                }
            }
        } catch (error) {
            throw new NotFoundException(`Invalid product ID format: ${id}`);
        }
    }

    // async #fetchCategoryName(category_id: string | mongoose.Types.ObjectId) {
    //     try {
    //         const category = await this.categoriesService.findOne(category_id);
    //         return category.category_name;
    //     } catch (error) {
    //         throw new NotFoundException(
    //             `Category with ID ${category_id} not found`
    //         );
    //     }
    // }

    // async #getProductShowList(
    //     productDataList: (mongoose.Document<unknown, {}, Product> &
    //         Omit<
    //             Product & {
    //                 _id: mongoose.Types.ObjectId;
    //             },
    //             never
    //         >)[]
    // ) {
    //     const productShowListPromises = productDataList.map(async (product) => {
    //         return {
    //             id: product._id,
    //             name: product.name,
    //             category: await this.#fetchCategoryName(product.category_id),
    //             description: product.description,
    //             price: product.price,
    //             image_url: product.image_url
    //         };
    //     });
    //     // Wait for all promises to resolve
    //     const resolvedProductShowList = await Promise.all(
    //         productShowListPromises
    //     );
    //     return resolvedProductShowList;
    // }

    // update(id: number, updateProductDto: UpdateProductDto) {
    //     return `This action updates a #${id} product`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} product`;
    // }
}
