import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { NotOwnerWishesGuard } from '../guards/notOwner.wishes.guard';

@UseGuards(JWTGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(NotOwnerWishesGuard)
  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offersService.create(createOfferDto, +req.user.id);
  }

  @Get()
  findAll() {
    return this.offersService.find({ relations: { user: true } });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne({
      where: { id: +id },
      relations: { user: true },
    });
  }
}
