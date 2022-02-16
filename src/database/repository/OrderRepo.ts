import { InternalError } from "../../core/ApiError";
import { EntityRepository, getRepository, Repository } from  "typeorm";
import { Order } from "../entity/Order";

@EntityRepository(Order)
export class OrderRepo extends Repository<Order> {
    createOrder = async (orderEntity : Order) => {
        console.log(`order Entity ${JSON.stringify(orderEntity)}`);
        
        const order = this.create(orderEntity);
        await this.save(order).catch((err) => {
            console.log("Error: ", err);
        })
    }

    removeOrder = async (orderId : string) => {
        const order = this.delete(orderId);
        // await this.save(order).catch((err) => {
        //     console.log("Error: ", err);
        // })
    }

    findById = async(id : string) => {
        return await this.findOne({ where: {id : id}}).catch((err) => {
            console.log("Error: ", err);
        });
    }

    findByUserId = async(id : string) => {
        return await this.find({ where: {user_id : id}, relations:["orderItems"]}).catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Unable to complete request', ${err?.sqlMessage}`);
        });
    }

    getAll = async() => {
        return await this.find().catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Unable to complete request', ${err?.sqlMessage}`);
        });
    }
}