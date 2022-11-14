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
import { BadRequestException } from '@nestjs/common/exceptions';
import { Public } from 'src/auth/decorators/public.guard.decorator';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Request() req, @Body() createCollectionDto: CreateCollectionDto) {
    const { user_id } = req.user;

    return this.collectionsService.create(user_id, createCollectionDto);
  }

  @Get()
  findAll(@Request() req) {
    const { user_id } = req.user;

    if (!user_id) {
      throw new BadRequestException();
    }
    return this.collectionsService.findAll(user_id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') collection_id: string) {
    return this.collectionsService.findOneById(collection_id);
  }

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

  @Delete(':id')
  remove(@Request() req, @Param('id') collection_id: string) {
    const { user_id } = req.user;
    return this.collectionsService.remove(user_id, collection_id);
  }
}
