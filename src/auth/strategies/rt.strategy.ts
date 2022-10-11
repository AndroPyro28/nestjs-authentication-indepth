import { Injectable, Req } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, 'jwt_refresh_token') {
    /**
     *
     */
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'rt-secret',
            passReqToCallback: true
        });
    }

    async validate(@Req() req: Request, payload: any) {
        const token = req.headers.authorization.split(' ');
        return {
            ...payload,
            token
        };
    }
}