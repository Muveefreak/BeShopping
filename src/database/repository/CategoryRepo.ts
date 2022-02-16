import { InternalError } from "../../core/ApiError";
import { EntityRepository, getRepository, Repository } from  "typeorm";
import { Category } from "../entity/Category";

@EntityRepository(Category)
export class CategoryRepo extends Repository<Category> {
    createCategory = async (categoryEntity : Category) => {
        const category = this.create(categoryEntity);
        await this.save(category).catch((err) => {
            console.log("Error: ", err);
        })
    }

    findById = async(id : string) => {
        return await this.findOne({ where: {id : id}}).catch((err) => {
            console.log("Error: ", err);
        });
    }

    findByName = async(name : string) => {
        return await this.findOne({ where: {name : name}}).catch((err) => {
            console.log("Error: ", err);
        });
    }

    getAll = async() => {
        return await this.find().catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Unable to complete request', ${err?.sqlMessage}`);
        });
    }
}