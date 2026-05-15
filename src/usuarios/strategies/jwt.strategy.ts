import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'super_secret_hackathon_avax',
    });
  }

  async validate(payload: any) {
    if (!payload?.address || !payload?.email) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      address: payload.address,
      email: payload.email,
      role: payload.role,
    };
  }
}
