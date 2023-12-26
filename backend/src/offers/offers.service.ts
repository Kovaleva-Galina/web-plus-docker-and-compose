import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { UsersService } from '..//users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, owner: number) {
    const { amount, itemId, hidden } = createOfferDto;
    await this.wishesService.updateRaised({ id: itemId }, amount);
    await this.offerRepository.save({
      amount,
      hidden,
      user: await this.usersService.findOne({ where: { id: owner } }),
      item: await this.wishesService.findOne({ where: { id: itemId } }),
    });
    return {};
  }

  async find(query?: FindOneOptions<Offer>) {
    return this.offerRepository.find(query);
  }

  async findOne(query: FindOneOptions<Offer>) {
    return this.offerRepository.findOne(query);
  }

  async updateOne(
    query: FindOptionsWhere<Offer>,
    updateOfferDto: UpdateOfferDto,
  ) {
    const { amount, itemId, hidden } = updateOfferDto;
    return this.offerRepository.update(query, {
      amount,
      hidden,
      item: await this.wishesService.findOne({ where: { id: itemId } }),
    });
  }

  async removeOne(query: FindOptionsWhere<Offer>) {
    await this.offerRepository.delete(query);
    return true;
  }

  async isOwner(offerId: number, userId: number): Promise<boolean> {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: { user: true },
    });

    if (!offer) {
      throw new NotFoundException();
    }

    return offer?.user?.id === userId;
  }
}
