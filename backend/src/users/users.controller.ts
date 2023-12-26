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
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { WishesService } from '../wishes/wishes.service';

@UseGuards(JWTGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findOne({ where: { id: req.user.id } });
  }

  @Patch('me')
  patchMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne({ id: req.user.id }, updateUserDto);
  }

  @Delete('me')
  deleteMe(@Req() req) {
    return this.usersService.removeOne({ id: req.user.id });
  }

  @Get(':username')
  findUserByUserName(@Param('username') username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @Post('find')
  find(@Body() findManyUsersDto: FindManyUsersDto) {
    const { query } = findManyUsersDto;
    return this.usersService.findMany(query);
  }

  @Get('me/wishes')
  async getMyWishes(@Req() req) {
    return this.wishesService.find({
      where: { owner: { id: +req.user.id } },
      relations: { offers: true, owner: true },
    });
  }

  @Get('me/wishes')
  getUserWishes(@Req() req) {
    return this.wishesService.find({
      where: { owner: { id: +req.user.id } },
      relations: { offers: true },
    });
  }

  @Get(':username/wishes')
  async getUserByUserName(@Param('username') username: string) {
    const user = await this.usersService.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException();
    }
    return this.wishesService.find({
      where: { owner: { id: user.id } },
      relations: { offers: true },
    });
  }
}
