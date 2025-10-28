import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from 'src/products/products.service';

interface FlaskRecommendation {
    product_id: string;
    final_score: number;
}

@Injectable()
export class RecommendationService {
    private recommendationServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly productsService: ProductsService
    ) {
        this.recommendationServiceUrl = this.configService.get<string>(
            'RECOMMENDATION_SERVICE_URL'
        );
        if (!this.recommendationServiceUrl) {
            throw new Error(
                'RECOMMENDATION_SERVICE_URL is not defined in .env'
            );
        }
    }

    async fetchRecommendations(userId: string) {
        try {
            const flaskApiUrl = `${this.recommendationServiceUrl}/recommend/${userId}`;

            const response = await firstValueFrom(
                this.httpService.get<{
                    recommendations: FlaskRecommendation[];
                }>(flaskApiUrl)
            );
            console.log('response:', response);

            const recommendedItems = response.data.recommendations;

            if (!recommendedItems || recommendedItems.length === 0) {
                return [];
            }

            const productIds = recommendedItems.map((item) => item.product_id);

            const detailedProducts = await this.productsService.findManyByIds(
                productIds
            );

            const orderedDetailedProducts = productIds
                .map((id) =>
                    detailedProducts.find(
                        (p) => p.id.toString() === id.toString()
                    )
                )
                .filter((p) => p !== undefined);

            return orderedDetailedProducts;
        } catch (error) {
            throw new BadRequestException(
                'Error while fetching recommendations ' + error.message
            );
        }
    }

    // create(createRecommendationDto: CreateRecommendationDto) {
    //     return 'This action adds a new recommendation';
    // }
    // findAll() {
    //     return `This action returns all recommendation`;
    // }
    // findOne(id: number) {
    //     return `This action returns a #${id} recommendation`;
    // }
    // update(id: number, updateRecommendationDto: UpdateRecommendationDto) {
    //     return `This action updates a #${id} recommendation`;
    // }
    // remove(id: number) {
    //     return `This action removes a #${id} recommendation`;
    // }
}
