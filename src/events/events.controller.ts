import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Public } from 'src/auth/decorators/public.guard.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const { user_id } = req.user;

    return this.eventsService.create(user_id, createEventDto);
  }

  @Get()
  findAll(@Request() req) {
    const { user_id } = req.user;

    return this.eventsService.findAll(user_id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') event_id: string) {
    return this.eventsService.findOne(event_id);
  }

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

  @Delete(':id')
  remove(@Request() req, @Param('id') event_id: string) {
    const { user_id } = req.user;
    return this.eventsService.remove(user_id, event_id);
  }
}
