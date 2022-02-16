import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { Category } from "./Category";

@Entity({ name: "products" })
export class Product {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    name: string;

    @Column()
    sku: string;

    @Column()
    selling_price: number;

    @Column()
    quantity: number;

    @Column()
    category_id: string;

    @ManyToOne(type => Category)
    @JoinColumn({name: 'category_id', referencedColumnName: 'id'})
    category: Category;
}
