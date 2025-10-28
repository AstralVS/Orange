import { PartialType } from '@nestjs/mapped-types';
import { CreateUserActionDto } from './create-user_action.dto';

export class UpdateUserActionDto extends PartialType(CreateUserActionDto) {}
