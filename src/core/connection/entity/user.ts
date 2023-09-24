import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// import { Entity, PrimaryGeneratedColumn, Column } from "/opt/nodejs/typeorm";

/**
 * User table structure
 * 
 * @see link [typeorm gitbook docs](https://orkhan.gitbook.io/typeorm/docs)
 * @see link [typeorm](https://typeorm.io/)
 * @see link [TypeORM: Adding Fields with Nullable/Default Data](https://www.kindacode.com/snippet/typeorm-adding-fields-with-nullable-default-data/)
 */
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    username: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string
}
