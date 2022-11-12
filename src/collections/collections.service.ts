import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(user_id: string, createCollectionDto: CreateCollectionDto) {
    try {
      const { title } = createCollectionDto;

      const user = await this.usersService.findUsersById(user_id);

      if (!user) {
        throw new BadRequestException("User doesn't exist");
      }

      const newCollection = await this.prisma.collection.create({
        data: { title, user_id: user.id },
      });

      return newCollection;
    } catch (err) {
      throw err;
    }
  }

  async findAll(user_id: string) {
    try {
      const user = await this.usersService.findUsersById(user_id);

      const collections = await this.prisma.collection.findMany({
        where: { user_id: user.id },
        select: {
          id: true,
          title: true,
          created_at: true,
          updated_at: true,
          _count: true,
        },
      });

      return collections;
    } catch (err) {
      throw err;
    }
  }

  async findOneById(collection_id: string) {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collection_id },
        select: {
          id: true,
          title: true,
          created_at: true,
          updated_at: true,
          events: true,
        },
      });

      if (!collection) {
        throw new NotFoundException('Collection not found');
      }
      return collection;
    } catch (err) {
      throw err;
    }
  }

  async update(
    user_id: string,
    collection_id: string,
    updateCollectionDto: UpdateCollectionDto,
  ) {
    try {
      const { title } = updateCollectionDto;

      const collection = await this.prisma.collection.findUnique({
        where: { id: collection_id },
      });

      if (!collection || collection.user_id !== user_id) {
        throw new BadRequestException("Collection doesn't exist");
      }
      const updatedCollection = await this.prisma.collection.update({
        where: { id: collection.id },
        data: { title },
      });
      return updatedCollection;
    } catch (err) {
      throw err;
    }
  }

  async remove(user_id: string, collection_id: string) {
    try {
      // check if collection exist and belongs to current user
      const collection = await this.prisma.collection.findUnique({
        where: { id: collection_id },
      });

      if (!collection || collection.user_id !== user_id) {
        throw new BadRequestException();
      }

      const deletedCollection = await this.prisma.collection.delete({
        where: { id: collection.id },
      });

      return {
        message: `Collection '${deletedCollection.title}' has been deleted.`,
      };
    } catch (err) {
      throw err;
    }
  }
}
