import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserActionDto } from './dto/create-user_action.dto';
import { UserAction } from './schemas/user_action.schema';

@Injectable()
export class UserActionsService {
    constructor(
        @InjectModel(UserAction.name)
        private readonly userActionModel: Model<UserAction>
    ) {}

    async create(createUserActionDto: CreateUserActionDto) {
        const result = await this.userActionModel.create(createUserActionDto);
        return result;
    }

    // findAll() {
    //     return `This action returns all userActions`;
    // }

    // findOne(id: number) {
    //     return `This action returns a #${id} userAction`;
    // }

    // update(id: number, updateUserActionDto: UpdateUserActionDto) {
    //     return `This action updates a #${id} userAction`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} userAction`;
    // }
}
