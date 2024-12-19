// import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import * as argon from 'argon2';
// import { File } from './File.entity';

// @Entity()
// export class User extends BaseEntity {
//     @PrimaryGeneratedColumn()
//     userid: number;

//     @Column({
//         type: 'nvarchar',
//         length: 30,
//         nullable: false,
//     })
//     fullname: string;

//     @Column({
//         type: 'nvarchar',
//         length: 100,
//         nullable: false,
//         unique: true,
//     })
//     email: string;

//     @Column({
//         type: 'nvarchar',
//         length: 20,
//         nullable: false,
//         unique: true,
//     })
//     username: string;

//     @Column({
//         type: 'nvarchar',
//         length: 255,
//         nullable: false,
//     })
//     password: string;

//     @OneToMany(() => File, (history) => history.user)
//     files: Array<File>;

//     @BeforeInsert()
//     public async HashPassword() {
//         const matkhau = await argon.hash(this.password, {
//             hashLength: 100,
//         });
//         this.password = matkhau;
//     }
//     public async verifyPassword(matkhau: string): Promise<boolean> {
//         return await argon.verify(matkhau, this.password);
//     }
// }
