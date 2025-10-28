import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Category', required: true })
    category_id: mongoose.Types.ObjectId;

    @Prop({ trim: true })
    description?: string;

    @Prop({ type: Number, default: 0 })
    price: number;

    @Prop({ trim: true })
    image_url?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
