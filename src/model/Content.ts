import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './File';
import { ChatEnum } from 'src/enum/chat.enum';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  contentID: number;

  @Column({
    type: 'nvarchar',
    enum: ChatEnum,
    nullable: false,
  })
  flag: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  historyID: number;
  @ManyToOne(() => File, (file) => file.contents)
  history: File;
}
