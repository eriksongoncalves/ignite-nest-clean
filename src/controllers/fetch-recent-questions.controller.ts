import { CurrentUser } from '@/auth/current-user.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { z } from 'zod'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

@Controller()
@UseGuards(new JwtAuthGuard())
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get('/questions')
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const { sub } = user
    const peerPage = 1

    const questions = await this.prisma.question.findMany({
      take: peerPage,
      skip: (page - 1) * peerPage,
      where: {
        authorId: sub,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
