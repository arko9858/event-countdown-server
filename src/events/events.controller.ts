import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const { user_id } = req.user;

    return this.eventsService.create(user_id, createEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const { user_id } = req.user;

    return this.eventsService.findAll(user_id);
  }

  @Get(':id')
  findOne(@Param('id') event_id: string) {
    return this.eventsService.findOne(event_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') event_id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const { user_id } = req.user;

    if (!user_id || !event_id) {
      throw new BadRequestException();
    }

    return this.eventsService.update(user_id, event_id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') event_id: string) {
    const { user_id } = req.user;
    return this.eventsService.remove(user_id, event_id);
  }
}
