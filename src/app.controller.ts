import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.guard.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  testPublic(@Request() req): string {
    console.log(req.user);
    return this.appService.getHello();
  }

  @Get('auth')
  testAuth(@Request() req): string {
    console.log(req.user);
    return this.appService.getHello();
  }
}
