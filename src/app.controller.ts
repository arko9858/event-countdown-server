import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  testPublic(@Request() req): string {
    console.log(req.user);
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth')
  testAuth(@Request() req): string {
    console.log(req.user);
    return this.appService.getHello();
  }
}
