import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/sign-up')
    public signUpUser(@Body() dto: SignUpUserDto) {
        return this.authService.signUpUser(dto);
    }

    @Post('/sign-in')
    public signInUser(@Body() dto: SignInUserDto) {
        return this.authService.signInUser(dto);
    }

    @Post('/sign-out')
    public signOutUser(@Body() dto: RefreshTokenDto) {
        this.authService.signOutUser(dto.refreshToken);

        return { message: 'user signed out' };
    }

    @Post('/new-token')
    public getNewAccessToken(@Body() dto: RefreshTokenDto) {
        return this.authService.getNewAccessToken(dto.refreshToken);
    }
}
