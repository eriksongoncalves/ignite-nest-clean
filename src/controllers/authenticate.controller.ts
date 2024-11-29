import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('E-mail or password invalid')
    }

    const token = this.jwt.sign({ sub: 'user-id' })

    return token

    // const hashPassword = await hash(password, 6)

    // await this.prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashPassword,
    //   },
    // })
  }
}
