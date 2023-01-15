import { Body, Controller, Post, Query, UsePipes } from '@nestjs/common';

import { PrivacyInfo, PrivacyInfoDecorator } from 'src/decorators/privacy-info.decorator';
import { ValidationPipe } from 'src/pipes/validation.pipe';

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
        this.authService.signOutUser(dto.refreshToken);
    }

    @Post('/new-token')
    public getNewAccessToken(@Body() dto: RefreshTokenDto) {
        return this.authService.getNewAccessToken(dto.refreshToken);
    }
}
