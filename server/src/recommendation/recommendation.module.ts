import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';

@Module({
    imports: [HttpModule, ProductsModule],
    controllers: [RecommendationController],
    providers: [RecommendationService]
})
export class RecommendationModule {}
