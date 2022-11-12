import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createCollectionDto: CreateCollectionDto) {
    const { user_id } = req.user;

    return this.collectionsService.create(user_id, createCollectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const { user_id } = req.user;

    if (!user_id) {
      throw new BadRequestException();
    }
    return this.collectionsService.findAll(user_id);
  }

  @Get(':id')
  findOne(@Param('id') collection_id: string) {
    return this.collectionsService.findOneById(collection_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') collection_id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    const { user_id } = req.user;

    if (!user_id || !collection_id) {
      throw new BadRequestException();
    }

    return this.collectionsService.update(
      user_id,
      collection_id,
      updateCollectionDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') collection_id: string) {
    const { user_id } = req.user;
    return this.collectionsService.remove(user_id, collection_id);
  }
}
