import { InternalError } from "../../core/ApiError";
import { EntityRepository, Repository } from  "typeorm";
import { Product } from "../entity/Product";


@EntityRepository(Product)
export class ProductRepo extends Repository<Product>  {
    createProduct = async (productEntity : Product) => {
        console.log(`Product Entity ${JSON.stringify(productEntity)}`);
        const product = this.create(productEntity);
        console.log(`Product ${JSON.stringify(product)}`);
        
        await this.save(product).catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Product was not created successfully , ${err}`)
        })
    }

    updateProductQuantity = async (productEntity : Product, quantity: number) => {
        productEntity.quantity += quantity;
        await this.save(productEntity).catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Product was not created successfully , ${err}`)
        })
    }

    findByName = async(name : string) => {
        return await this.findOne({ where: {name : name}}).catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Unable to complete request', ${err?.sqlMessage}`);
        });
    }

    findById = async(id : string) => {
        return await this.findOne({ where: {id : id}}).catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Unable to complete request', ${err?.sqlMessage}`);
        });
    }

    findByCategoryId = async(id : string) => {
        return await this.find({ where: {category_id : id}}).catch((err) => {
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


