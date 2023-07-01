/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy,  Profile} from 'passport-google-oauth20';
import { AuthService } from '../auth.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const user = await this.authService.validateUser({
      email: profile.emails[0].value,
      firstName: profile.displayName,
      lastName: '',
      password: '',
      phone: '',
      location: '',
      avatarURL: '',
      role: '',
      isOnline: false,
      postsId: [],
      token: '',
      verify: false,
      verificationToken: '',
      googleId: ''
    });    
    return user || null;
  }
}