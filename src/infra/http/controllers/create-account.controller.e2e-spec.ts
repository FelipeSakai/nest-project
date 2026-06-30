import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Server } from 'http';
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import request from "supertest";
import { AppModule } from '@/infra/app.module';

describe('Create account E2E', () => {
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

    test('[POST] /accounts', async () => {
        const email = `test-${randomUUID()}@example.com`;

        const response = await request(app.getHttpServer() as unknown as Server)
            .post('/accounts')
            .send({
                name: 'Test User',
                email,
                password: 'password123',
            });

        expect(response.statusCode).toBe(201);

        const userOnDb = await prisma.user.findUnique({
            where: { email },
        });

        expect(userOnDb).toBeTruthy();
    });
});
