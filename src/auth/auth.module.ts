import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { Env } from '@/env'
import { AuthenticateController } from '@/controllers/authenticate.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        const privatekey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publickey = config.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          signOptions: { algorithm: 'RS256' },
          privatekey: Buffer.from(privatekey, 'base64'),
          publickey: Buffer.from(publickey, 'base64'),
        }
      },
    }),
  ],
  controllers: [AuthenticateController],
})
export class AuthModule {}
