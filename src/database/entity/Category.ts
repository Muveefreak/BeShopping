import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";

@Entity({ name: "categories"})
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 80})
    name: string;

    @Column({ type: "varchar", length: 300})
    description: string;
}