import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import request from "supertest";

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

        const response = await request(app.getHttpServer())
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
