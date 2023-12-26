import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @OneToOne(() => Wish, (Wish) => Wish.id)
  @JoinColumn()
  items: Wish[];

  @OneToOne(() => User, (User) => User.wishlists)
  @JoinColumn()
  owner: User;
}
