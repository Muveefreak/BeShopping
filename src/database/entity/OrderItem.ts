import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";

@Entity({ name: "orderItems"})
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 80})
    name: string;

    @Column()
    quantity: number;

    @Column()
    order_id: string;

    @ManyToOne(type => Order)
    @JoinColumn({name: 'order_id', referencedColumnName: 'id'})
    order: Order;
}