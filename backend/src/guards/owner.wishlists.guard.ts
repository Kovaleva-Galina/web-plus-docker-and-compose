import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { WishlistsService } from '../wishlists/wishlists.service';

@Injectable()
export class OwnerWishlistsGuard implements CanActivate {
  constructor(private wishlistsService: WishlistsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = +req.user?.id;
    const wishlistId = +req.params?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    if (!wishlistId) {
      throw new NotFoundException();
    }

    const isOwner = await this.wishlistsService.isOwner(wishlistId, userId);

    if (!isOwner) {
      throw new ForbiddenException();
    }

    return true;
  }
}
