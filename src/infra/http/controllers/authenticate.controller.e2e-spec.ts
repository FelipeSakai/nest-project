import { PrismaService } from '@/infra/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { AppModule } from '@/infra/app.module';

describe('Authenticate E2E', () => {
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

  test('[POST] /sessions', async () => {
    const email = `test-${randomUUID()}@example.com`;
    const password = 'password123';

    await prisma.user.create({
      data: {
        name: 'Test User',
        email,
        password: await hash(password, 8),
      },
    });

    const response = await request(app.getHttpServer() as unknown as Server)
      .post('/sessions')
      .send({
        email,
        password,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    );
    expect(response.body.access_token.split('.')).toHaveLength(3);
  });
});
