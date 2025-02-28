import { Entity, ManyToOne } from 'typeorm';
import { Property } from './property.entity';
import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../common/entity/base.entity';


@Entity()
export class Gift extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sentGifts)
  giver: User;

  @ManyToOne(() => User, (user) => user.receivedGifts)
  recipient: User;

  @ManyToOne(() => Property)
  property: Property;
}