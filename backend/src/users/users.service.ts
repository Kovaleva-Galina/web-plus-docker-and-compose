import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, ILike } from 'typeorm';
import { getCols } from '../utils/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, withHiddenFields = false) {
    try {
      const { password, ...rest } = createUserDto;
      const { id } = await this.usersRepository.save({
        ...rest,
        password: await bcrypt.hash(password, 10),
      });
      const user = await this.findOne({ where: { id } }, withHiddenFields);
      return user;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if ((e.driverError as any).code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
      throw e;
    }
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findMany(query: string) {
    return this.usersRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
  }

  async findOne(query: FindOneOptions<User>, withHiddenFields = false) {
    return this.usersRepository.findOne(
      withHiddenFields
        ? { ...query, select: getCols(this.usersRepository) }
        : query,
    );
  }

  async updateOne(query: FindOptionsWhere<User>, updateUserDto: UpdateUserDto) {
    try {
      const newUser = { ...updateUserDto };
      if (newUser.password) {
        newUser.password = await bcrypt.hash(newUser.password, 10);
      }
      await this.usersRepository.update(query, newUser);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if ((e.driverError as any).code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже существует',
          );
        }
      }
      throw e;
    }
    return this.usersRepository.findOne({ where: query });
  }

  async removeOne(query: FindOptionsWhere<User>) {
    await this.usersRepository.delete(query);
    return true;
  }
}
