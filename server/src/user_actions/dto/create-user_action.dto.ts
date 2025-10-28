import {
    IsDateString,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional
} from 'class-validator';
import mongoose from 'mongoose';
import { ActionType } from '../schemas/user_action.schema';

export class CreateUserActionDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly user_id: string | mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    readonly product_id: string | mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsEnum(ActionType, {
        message: `action_type must be one of the following values: ${Object.values(
            ActionType
        ).join(', ')}`
    })
    action_type: ActionType;

    @IsOptional()
    @IsDateString()
    action_time?: Date;
}
