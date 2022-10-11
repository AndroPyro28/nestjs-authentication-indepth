import { Body, Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Email, GetCurrentUser, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
// import { AtGuard, RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public() // this will ignore the auth AtGuard stragegy validation and will consider public routes 
    @Post('/signup')
    signup(@Body() body: AuthDto): Promise<Tokens> {
       return this.authService.signup(body)
    }
    @Public() // this will ignore the auth AtGuard stragegy validation and will consider public routes 
    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() body: AuthDto): Promise<Tokens> {
       return this.authService.signin(body)
    }
    
    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUser('id') id: number) {
       return this.authService.logout(id)
    }

    @Public() // to ignore auth access token validation
    @UseGuards(RtGuard) // therefore we use refresh token to update the hashRt of the user
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@GetCurrentUser('id') userId: number, @GetCurrentUser('token') token: string ) {
        return this.authService.refresh(userId, token[1])
    }

   //  @Email('menandroeugenio1028@gmail.com') // similar to roles,
    // first we make a decorator that accepts a role
    @Email('menandroeugenio1028@gmail.com')
    @Get('/andro')
    getAndro(@GetCurrentUser() user: any) {
      console.log('authorized and role authorized', user);
    }
}
