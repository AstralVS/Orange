import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class PasswordService {
    getHashedPassword(plainPassword: string) {
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(plainPassword, salt);

        return hashedPassword;
    }

    comparePassword() {}
}
