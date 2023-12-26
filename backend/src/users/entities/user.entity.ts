import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, JoinColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, Length, IsUrl, IsEmail } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @Length(2, 30) // Ограничение длины от 2 до 30 символов
  @IsNotEmpty() // Обязательное поле
  username: string;

  @Column({ nullable: true })
  @Length(2, 200) // Ограничение длины от 2 до 200 символов
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl() // Проверка, что значение является URL
  avatar: string;

  @Column({ unique: true })
  @IsEmail() // Проверка, что значение является действительным адресом электронной почты
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Wish, (Wish) => Wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (Offer) => Offer.user)
  @JoinColumn()
  offers: Offer[];

  @OneToMany(() => Wishlist, (Wishlist) => Wishlist.owner)
  @JoinColumn()
  wishlists: Wishlist[];
}
