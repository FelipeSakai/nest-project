import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) { }

    transform(value: unknown) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new BadRequestException(fromZodError(error).message);
            }
            throw new BadRequestException('Validation failed');
        }
    }
}
