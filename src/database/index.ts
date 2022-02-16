import {createConnection} from "typeorm";
import { db } from '../config';
import { Category } from "./entity/Category";
import { Order } from "./entity/Order";
import { OrderItem } from "./entity/OrderItem";
import { Product } from "./entity/Product";
import { User } from "./entity/User";

const connection = createConnection({
    type: "mysql",
    host: db.host,
    port: Number(db.port),
    username: db.user,
    password: db.password,
    database: db.name,
    entities: [
        Product, Category, Order, User, OrderItem
    ],
    synchronize: true
})
.then(async connection => {
    console.info('MySql connection done');
})
.catch((e) => {
    console.info('MySql connection error');
    console.error(e);
});