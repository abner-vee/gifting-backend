import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';

@Entity()
export class Property extends BaseEntity{

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  image: string;
}