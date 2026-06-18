import { PipeTransform, BadRequestException } from '@nestjs/common';
import { z, ZodError, ZodType } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) { }

    transform(value: unknown,) {
        try {
            this.schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new BadRequestException(fromZodError(error).message);
            }
            throw new BadRequestException('Validation failed');
        }
        return value;
    }
}
