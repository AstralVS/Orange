import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateProductDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsMongoId()
    readonly category_id: string | mongoose.Types.ObjectId;

    @IsOptional()
    price?: number;

    @IsOptional()
    description?: string;

    @IsOptional()
    image_url?: string;
}
