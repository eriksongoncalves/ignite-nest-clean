import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get('/users')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUsers(): Promise<any[]> {
    return await this.prisma.user.findMany()
  }
}
