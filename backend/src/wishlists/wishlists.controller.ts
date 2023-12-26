import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { OwnerWishlistsGuard } from '../guards/owner.wishlists.guard';

@UseGuards(JWTGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(createWishlistDto, +req.user.id);
  }

  @Get()
  findAll() {
    return this.wishlistsService.find({
      relations: { items: true, owner: true },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne({
      where: { id: +id },
      relations: { items: true, owner: true },
    });
  }

  @UseGuards(OwnerWishlistsGuard)
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOne({ id: +id }, updateWishlistDto);
  }

  @UseGuards(OwnerWishlistsGuard)
  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.wishlistsService.removeOne({ id: +id });
  }
}
