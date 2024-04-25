import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';import { UsersService } from 'src/users/users.service';
'./constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
      private usersService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY
        })
    }

    async validate(payload: any){
      const { user_id } = payload;
      const user = await this.usersService.findOne(user_id);
      if(!user){
          throw new UnauthorizedException();
      }
      return user;
    }
}