import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ default: "", nullable: false })
    title: string

    @Column({ default: "" })
    description: string

    @Column()
    complete: boolean

    @Column()
    owner: string
}
