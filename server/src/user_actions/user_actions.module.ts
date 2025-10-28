import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAction, UserActionSchema } from './schemas/user_action.schema';
import { UserActionsController } from './user_actions.controller';
import { UserActionsService } from './user_actions.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: UserAction.name,
                schema: UserActionSchema
            }
        ])
    ],
    controllers: [UserActionsController],
    providers: [UserActionsService]
})
export class UserActionsModule {}
