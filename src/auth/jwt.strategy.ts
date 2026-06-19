import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Env } from "src/env";
import z from "zod";

const tokenSchema = z.object({
    sub: z.uuid(),
});

type TokenSchema = z.infer<typeof tokenSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService<Env, true>) {
        const publicKey = Buffer.from(
            config.getOrThrow('JWT_PUBLIC_KEY', { infer: true }),
            'base64',
        ).toString('utf8');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: publicKey,
            algorithms: ['RS256'],
        })
    }

    async validate(payload: TokenSchema) {
        return tokenSchema.parse(payload);
    }
}
