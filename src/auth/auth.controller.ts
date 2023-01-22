import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';

import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { PrivacyInfoDecorator } from 'src/decorators/privacy-info.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { PrivacyInfo } from 'src/interfaces/privacy-info.interface';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UsersEntity } from 'src/users/users.entity';

import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(ValidationPipe)
    @Post('/sign-up')
    public signUpUser(@Body() dto: SignUpUserDto) {
        return this.authService.signUpUser(dto);
    }

    @Post('/confirm-email')
    public confirmEmail(@Query('verificationCode') verificationCode: string) {
        return this.authService.confirmEmail(verificationCode);
    }

    @Post('/sign-in')
    public signInUser(@Body() dto: SignInUserDto, @PrivacyInfoDecorator() privacyInfo: PrivacyInfo) {
        return this.authService.signInUser(dto, privacyInfo);
    }

    @Post('/sign-out')
    public signOutUser(@Body() dto: RefreshTokenDto) {
        return this.authService.signOutUser(dto.refreshToken);
    }

    @Get('/new-access-token')
    public getNewAccessToken(@Body() dto: RefreshTokenDto) {
        return this.authService.getNewAccessToken(dto.refreshToken);
    }

    @UseGuards(AuthGuard)
    @Get('/sessions')
    public getUserSessions(@CurrentUserDecorator() currentUser: UsersEntity) {
        return this.authService.getUserSessions(currentUser);
    }
}
