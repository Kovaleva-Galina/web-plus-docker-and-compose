import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UsersService } from '..//users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, owner: number) {
    return this.wishesRepository.save({
      ...createWishDto,
      owner: await this.usersService.findOne({ where: { id: owner } }),
    });
  }

  async findLast() {
    return this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'ASC' },
      relations: { owner: true, offers: true },
    });
  }

  async findTop() {
    return this.wishesRepository.find({
      take: 10,
      order: { copied: 'ASC' },
      relations: { owner: true, offers: true },
    });
  }

  async find(query: FindOneOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  async findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }

  async updateOne(query: FindOptionsWhere<Wish>, updateWishDto: UpdateWishDto) {
    const oldWish = await this.wishesRepository.findOne({
      where: query,
      relations: { offers: true },
    });
    if (!oldWish) {
      throw new NotFoundException();
    }
    if (oldWish.offers.length) {
      throw new ForbiddenException();
    }
    return this.wishesRepository.update(query, updateWishDto);
  }

  async removeOne(query: FindOptionsWhere<Wish>) {
    await this.wishesRepository.delete(query);
    return true;
  }

  async isOwner(wishId: number, userId: number): Promise<boolean> {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException();
    }

    return wish?.owner?.id === userId;
  }

  async copy(wishId: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
    });

    if (!wish) {
      throw new NotFoundException();
    }

    await this.create(wish, userId);
    await this.updateCopied({ id: wishId });
  }

  async updateCopied(query: FindOptionsWhere<Wish>, value = 1) {
    const wish = await this.wishesRepository.findOne({ where: query });

    if (!wish) {
      throw new NotFoundException();
    }

    await this.wishesRepository.update(
      { id: wish.id },
      { copied: wish.copied + value },
    );
  }

  async updateRaised(query: FindOptionsWhere<Wish>, raised = 0) {
    const wish = await this.wishesRepository.findOne({ where: query });

    if (!wish) {
      throw new NotFoundException();
    }

    const newRaised = wish.raised + raised;

    if (wish.price < newRaised) {
      throw new ForbiddenException(
        'Сумма взноса на подарок превышает требуемую сумму',
      );
    }

    await this.wishesRepository.update({ id: wish.id }, { raised: newRaised });
  }
}
