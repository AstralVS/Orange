import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
    constructor(
        private readonly recommendationService: RecommendationService
    ) {}

    @Get(':user_id')
    getRecommendations(@Param('user_id') userId: string) {
        console.log('userId:', userId);
        return this.recommendationService.fetchRecommendations(userId);
    }

    // @Post()
    // create(@Body() createRecommendationDto: CreateRecommendationDto) {
    //     return this.recommendationService.create(createRecommendationDto);
    // }

    // @Get()
    // findAll() {
    //     return this.recommendationService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.recommendationService.findOne(+id);
    // }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateRecommendationDto: UpdateRecommendationDto
    // ) {
    //     return this.recommendationService.update(+id, updateRecommendationDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.recommendationService.remove(+id);
    // }
}
