import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { OffersService } from '../offers/offers.service';

@Injectable()
export class NotOwnerOfferGuard implements CanActivate {
  constructor(private offersService: OffersService) {}
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

    const isOwner = await this.offersService.isOwner(itemId, userId);

    if (isOwner) {
      throw new ForbiddenException();
    }

    return true;
  }
}
