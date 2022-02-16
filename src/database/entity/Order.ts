import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { OrderItem } from "./OrderItem";
import { User } from "./User";

@Entity({ name: "order"})
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column('varchar', {default:'0'})
    status: string = '0';

    @Column()
    user_id: string;

    @Column()
    @CreateDateColumn()
    created_at: Date;

    @OneToMany(type => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];
}