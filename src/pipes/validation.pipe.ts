import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
    public async transform(value: any, metadata: ArgumentMetadata) {
        // get an object that we will validate
        const validationTarget = plainToClass(metadata.metatype, value);

        // get errors that will be returned after validation the target object
        const validationErrors = await validate(validationTarget);

        // if errors array contains elements
        if (validationErrors.length > 0) {
            // console.log(validationErrors);
            throw new UnauthorizedException({ message: '12' });
            // const messages = validationErrors.map((error) => {
            //     return error.property + ' - ' + Object.values(error.constraints).join(', ');
            // });
            // throw new ValidationException(messages);
        }

        return value;
    }
}
