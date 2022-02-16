import { InternalError } from "../../core/ApiError";
import { EntityRepository, getRepository, Repository } from  "typeorm";
import { User } from "../entity/User";

@EntityRepository(User)
export class UserRepo extends Repository<User> {

    findById = async(id : string) => {
        return await this.findOne({ where: {id : id}}).catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Unable to complete request', ${err?.sqlMessage}`);
        });
    }

    findByEmail = async(email : string) => {
        return await this.findOne({ where: {email : email}}).catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Unable to complete request', ${err?.sqlMessage}`);
        });
    }

    createUser = async (userEntity : User) => {
            const now = new Date();
            userEntity.createdAt = now;
            const user = this.create(userEntity);
            await this.save(user).catch((err) => {
                console.log("Error: ", err);
                throw new InternalError(`User was not created successfully , ${err}`)
            })
            return { user: userEntity };
    }

    getAll = async() => {
        return await this.find().catch((err) => {
            console.log("Error: ", err);
            throw new InternalError(`Unable to complete request', ${err?.sqlMessage}`);
        });
    }
}