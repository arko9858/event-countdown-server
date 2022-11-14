import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(user_id: string, createEventDto: CreateEventDto) {
    try {
      const { date, title, collection_id } = createEventDto;

      const user = await this.usersService.findUsersById(user_id);

      const newEvent = await this.prisma.event.create({
        data: { title, date, collection_id, user_id: user.id },
        select: {
          id: true,
          title: true,
          date: true,
          collection_id: true,
          created_at: true,
          updated_at: true,
        },
      });

      return newEvent;
    } catch (err) {
      throw err;
    }
  }

  async findAll(user_id: string) {
    try {
      const user = await this.usersService.findUsersById(user_id);

      const events = await this.prisma.event.findMany({
        where: { user_id: user.id },
        select: {
          id: true,
          title: true,
          date: true,
          collection_id: true,
          created_at: true,
          updated_at: true,
        },
      });

      return events;
    } catch (err) {
      throw err;
    }
  }

  async findOne(event_id: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: event_id },
        select: {
          id: true,
          title: true,
          date: true,
          created_at: true,
          updated_at: true,
          collection: {
            select: {
              id: true,
              title: true,
              created_at: true,
              updated_at: true,
              _count: true,
            },
          },
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }
      return event;
    } catch (err) {
      throw err;
    }
  }

  async update(
    user_id: string,
    event_id: string,
    updateEventDto: UpdateEventDto,
  ) {
    try {
      const { title, date } = updateEventDto;

      const collection_id = updateEventDto.collection_id || null;

      // if collection_id is provided check if it belongs to current user
      if (collection_id) {
        const collection = await this.prisma.collection.findUnique({
          where: { id: collection_id },
        });

        if (!collection || collection.user_id !== user_id) {
          throw new BadRequestException('Collection not found');
        }
      }

      const event = await this.prisma.event.findUnique({
        where: { id: event_id },
      });

      if (!event || event.user_id !== user_id) {
        throw new BadRequestException("Event doesn't exist");
      }

      const updateData: {
        title: string;
        date: string;
        collection_id?: string;
      } = {
        title,
        date,
      };

      if (collection_id) {
        updateData.collection_id = collection_id;
      }

      const updatedEvent = await this.prisma.event.update({
        where: { id: event.id },
        data: updateData,
        select: {
          id: true,
          title: true,
          date: true,
          collection_id: true,
          created_at: true,
          updated_at: true,
        },
      });
      return updatedEvent;
    } catch (err) {
      throw err;
    }
  }

  async remove(user_id: string, event_id: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: event_id },
      });

      // check if event exist and belongs to current user
      if (!event || event.user_id !== user_id) {
        throw new BadRequestException();
      }

      const deletedEvent = await this.prisma.event.delete({
        where: { id: event.id },
      });

      return {
        message: `Event '${deletedEvent.title}' has been deleted.`,
      };
    } catch (err) {
      throw err;
    }
  }
}
