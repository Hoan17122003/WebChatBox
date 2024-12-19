import { File } from './File';
import * as argon from 'argon2';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column({
    type: 'nvarchar',
    length: 30,
    nullable: false,
  })
  fullname: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @OneToMany(() => File, (history) => history.user)
  files: Array<File>;

  public async HashPassword() {
    const matkhau = await argon.hash(this.password, {
      hashLength: 100,
    });
    this.password = matkhau;
  }
  public async verifyPassword(matkhau: string): Promise<boolean> {
    return await argon.verify(matkhau, this.password);
  }
}
