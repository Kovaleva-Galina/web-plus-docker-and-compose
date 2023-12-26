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
export class OwnerWishesGuard implements CanActivate {
  constructor(private wishesService: WishesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = +req.user?.id;
    const wishId = +req.params?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    if (!wishId) {
      throw new NotFoundException();
    }

    const isOwner = await this.wishesService.isOwner(wishId, userId);

    if (!isOwner) {
      throw new ForbiddenException();
    }

    return true;
  }
}
