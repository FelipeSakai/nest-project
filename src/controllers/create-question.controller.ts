import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decoretor';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import type { UserPayload } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
    title: z.string().max(100),
    content: z.string().max(500),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private prisma: PrismaService) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestionBody,
        @CurrentUser() user: UserPayload
    ) {
        const { title, content } = body;
        const userId = user.sub;

        const slug = this.convertToSlug(title);

        await this.prisma.question.create({
            data: {
                authorId: userId,
                title,
                content,
                slug,
            }
        });
    }

    private convertToSlug(value: string) {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
}
