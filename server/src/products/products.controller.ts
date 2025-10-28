import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import mongoose from 'mongoose';
import { BulkCreateProductsDto } from './dto/bulk-create-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Post('bulk')
    createBulk(@Body() bulkCreateProductsDto: BulkCreateProductsDto) {
        const { products } = bulkCreateProductsDto;
        return this.productsService.createBulk(products);
    }

    @Get()
    findMany(
        @Query('category_id') categoryId?: string | mongoose.Types.ObjectId
    ) {
        if (categoryId) {
            return this.productsService.findByCategoryId(categoryId);
        } else {
            return this.productsService.findAll();
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string | mongoose.Types.ObjectId) {
        return this.productsService.findOneByIdWithCategoryName(id);
    }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateProductDto: UpdateProductDto
    // ) {
    //     return this.productsService.update(+id, updateProductDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.productsService.remove(+id);
    // }
}
