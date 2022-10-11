import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { throws } from 'assert';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(body: AuthDto): Promise<Tokens> {
    const hashPw = await this.hasData(body.password);
    const newUser = await this.prismaService.user.create({
      data: {
        email: body.email,
        password: hashPw,
      },
    });
    const tokens = await this.signToken(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hasData(rt);
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async signin(body: AuthDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (!user) throw new ForbiddenException('Invalid Credentials');

    const isMatched = await argon.verify(user.password, body.password);

    if (!isMatched) throw new ForbiddenException('Invalid Credentials');
    const tokens = await this.signToken(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    return await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null
        }
      },
      data: {
        hashedRt: null
      }
    })
  }

  async refresh(userId: number, rt: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    const rtMatches = await argon.verify(user.hashedRt, rt);
    if(!rtMatches) throw new ForbiddenException('Access denied');
    const tokens = await this.signToken(user.id, user.email )
    await this.updateRtHash(user.id, tokens.refresh_token )
    return tokens
  }


  async signToken(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.sign(
        { id: userId, email },
        {
          expiresIn: '15m',
          secret: 'at-secret',
        },
      ),
      this.jwtService.sign(
        { id: userId, email },
        {
          expiresIn: '15m',
          secret: 'rt-secret',
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hasData(data: string) {
    return await argon.hash(data);
  }
}
