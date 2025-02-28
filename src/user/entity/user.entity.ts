import { Entity, Column, OneToMany } from 'typeorm';
import { Gift } from '../../gifting/entity/gift.entity';
import { BaseEntity } from '../../common/entity/base.entity';

@Entity()
export class User extends BaseEntity{

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Gift, (gift) => gift.giver)
  sentGifts: Gift[];

  @OneToMany(() => Gift, (gift) => gift.recipient)
  receivedGifts: Gift[];
}
