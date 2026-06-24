import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import request from 'supertest';

describe('Create question E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const email = `test-${randomUUID()}@example.com`;
    const password = 'password123';
    const title = `How to test questions ${randomUUID()}`;
    const content = 'Question content for e2e test.';

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email,
        password: await hash(password, 8),
      },
    });

    const authResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email,
        password,
      });

    expect(authResponse.statusCode).toBe(201);

    const { access_token } = authResponse.body;

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title,
        content,
      });

    expect(response.statusCode).toBe(201);

    const slug = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const questionOnDb = await prisma.question.findUnique({
      where: { slug },
    });

    expect(questionOnDb).toBeTruthy();
    expect(questionOnDb).toEqual(
      expect.objectContaining({
        title,
        content,
        slug,
        authorId: user.id,
      }),
    );
  });
});
