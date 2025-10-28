import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PasswordService } from 'src/helpers/password.helper/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly passwordService: PasswordService
    ) {}

    async create(createUserDto: CreateUserDto) {
        const { username, email, password } = createUserDto;
        const hashedPassword = await this.passwordService.getHashedPassword(
            password
        );
        const result = await this.userModel.create({
            username,
            email,
            password: hashedPassword
        });

        return result;
    }

    // Just for admin
    async findAll() {
        return await this.userModel.find();
    }

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Invalid ID';
        }
        return await this.userModel.findById(id);
    }
}
