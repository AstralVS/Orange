import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export enum ActionType {
    VIEW = 'VIEW',
    PURCHASE = 'PURCHASE'
}

export type UserActionDocument = HydratedDocument<UserAction>;

@Schema({ timestamps: true })
export class UserAction {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    })
    product_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: String, enum: Object.values(ActionType), required: true })
    action_type: ActionType;

    @Prop({ type: Date, default: Date.now })
    action_time: Date;
}

export const UserActionSchema = SchemaFactory.createForClass(UserAction);
