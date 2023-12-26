import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOneOptions, FindOptionsWhere, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const { itemsId, ...rest } = createWishlistDto;
    return this.wishlistRepository.save({
      ...rest,
      items: await this.wishesService.find({ where: { id: In(itemsId) } }),
      owner: await this.usersService.findOne({ where: { id: userId } }),
    });
  }

  async find(query?: FindOneOptions<Wishlist>) {
    return this.wishlistRepository.find(query);
  }

  async findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistRepository.findOne(query);
  }

  async updateOne(
    query: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const { itemsId, ...rest } = updateWishlistDto;
    return this.wishlistRepository.update(query, {
      ...rest,
      items: await this.wishesService.find({ where: { id: In(itemsId) } }),
    });
  }

  async removeOne(query: FindOptionsWhere<Wishlist>) {
    await this.wishlistRepository.delete(query);
    return true;
  }

  async isOwner(wishlistId: number, userId: number): Promise<boolean> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: { owner: true },
    });

    if (!wishlist) {
      throw new NotFoundException();
    }

    return wishlist?.owner?.id === userId;
  }
}
