import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import z from 'zod';

const createQuestionBodySchema = z.object({
    title: z.string().max(100),
    content: z.string().max(500),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    @Post()
    async handle() {
        return { message: 'Question created successfully' };
    }
}
