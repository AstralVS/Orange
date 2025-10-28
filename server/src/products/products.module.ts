import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema
            }
        ]),
        CategoriesModule
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService]
})
export class ProductsModule {}
