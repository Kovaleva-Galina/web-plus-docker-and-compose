import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { OwnerWishesGuard } from '../guards/owner.wishes.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JWTGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, +req.user.id);
  }

  @UseGuards(JWTGuard)
  @Get()
  findAll() {
    return this.wishesService.find({
      relations: { owner: true, offers: true },
    });
  }

  @Get('/last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('/top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JWTGuard, OwnerWishesGuard)
  @Patch(':id')
  patchMe(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne({ id: +id }, updateWishDto);
  }

  @UseGuards(JWTGuard, OwnerWishesGuard)
  @Delete(':id')
  deleteMe(@Param('id') id: string) {
    return this.wishesService.removeOne({ id: +id });
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  getMe(@Param('id') id: string) {
    return this.wishesService.findOne({
      where: { id: +id },
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  @UseGuards(JWTGuard)
  @Post(':id/copy')
  copy(@Param('id') id: string, @Req() req) {
    return this.wishesService.copy(+id, +req.user.id);
  }
}
