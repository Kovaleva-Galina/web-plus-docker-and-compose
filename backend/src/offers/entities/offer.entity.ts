import { Entity, Column, ManyToOne } from 'typeorm';
import { IsBoolean, IsDecimal } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (User) => User.wishes)
  user: User;

  @ManyToOne(() => Wish, (Wish) => Wish.offers)
  item: Wish;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @IsDecimal()
  amount: number;

  @Column({ default: 'false' })
  @IsBoolean()
  hidden: boolean;
}
