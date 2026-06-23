import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation-pipe';

describe('ZodValidationPipe', () => {
    it('returns transformed values from zod', () => {
        const pipe = new ZodValidationPipe(
            z.string().transform((value) => Number(value)),
        );

        const result = pipe.transform('2');

        expect(result).toBe(2);
    });

    it('throws BadRequestException for invalid values', () => {
        const pipe = new ZodValidationPipe(z.number().min(1));

        expect(() => pipe.transform(0)).toThrow(BadRequestException);
    });
});
