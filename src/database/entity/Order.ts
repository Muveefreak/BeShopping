import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
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

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User;

    @OneToMany(type => OrderItem, orderItem => orderItem.order, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    orderItems: Array<OrderItem>;
}