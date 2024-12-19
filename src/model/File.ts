import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Content } from './Content';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  fileID: number;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'number',
    nullable: false,
  })
  userID: number;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: false,
  })
  url: string;

  @ManyToOne(() => User, (user) => user.files)
  user: User;

  @OneToMany(() => Content, (content) => content.history)
  contents: Array<Content>;
}
