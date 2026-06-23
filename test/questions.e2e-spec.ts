import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Questions E2E', () => {
    let app: INestApplication;

    const prismaServiceMock = {
        question: {
            findMany: vi.fn(),
        },
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: () => true,
            })
            .overrideProvider(PrismaService)
            .useValue(prismaServiceMock)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('returns recent questions paginated', async () => {
        prismaServiceMock.question.findMany.mockResolvedValueOnce([
            {
                id: 'question-1',
                title: 'Primeira pergunta',
                content: 'Conteudo da pergunta',
                slug: 'primeira-pergunta',
                authorId: 'user-1',
                createdAt: new Date('2026-06-23T00:00:00.000Z'),
                updatedAt: new Date('2026-06-23T00:00:00.000Z'),
            },
        ]);

        const response = await request(app.getHttpServer())
            .get('/questions?page=2')
            .expect(200);

        expect(prismaServiceMock.question.findMany).toHaveBeenCalledWith({
            take: 1,
            skip: 1,
            orderBy: {
                createdAt: 'desc',
            },
        });
        expect(response.body).toEqual({
            questions: [
                {
                    id: 'question-1',
                    title: 'Primeira pergunta',
                    content: 'Conteudo da pergunta',
                    slug: 'primeira-pergunta',
                    authorId: 'user-1',
                    createdAt: '2026-06-23T00:00:00.000Z',
                    updatedAt: '2026-06-23T00:00:00.000Z',
                },
            ],
        });
    });
});
