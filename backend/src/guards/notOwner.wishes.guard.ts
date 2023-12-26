import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class NotOwnerWishesGuard implements CanActivate {
  constructor(private wishesService: WishesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = +req.user?.id;
    const itemId = +req.body?.itemId;

    if (!userId) {
      throw new UnauthorizedException();
    }

    if (!itemId) {
      throw new NotFoundException();
    }

    const isOwner = await this.wishesService.isOwner(itemId, userId);

    if (isOwner) {
      throw new ForbiddenException('Нельзя вносить деньги на свой подарок');
    }

    return true;
  }
}
