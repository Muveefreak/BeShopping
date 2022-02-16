import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn} from "typeorm";
import * as bcrypt from 'bcryptjs';

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "nvarchar", length: 256, nullable: false})
    name: string;

    @Column()
    role: string;

    @Column({ type: "nvarchar", length: 256, nullable: false})
    email: string;

    @Column({ type: "nvarchar", length: "500", nullable: false})
    passwordHash: string;

    @Column()
    @CreateDateColumn()
    created_at: Date;

    hashPassword() {
        this.passwordHash = bcrypt.hashSync(this.passwordHash, 8);
    }

    validateUnencryptedPassword(clearPassword: string) {
        return bcrypt.compareSync(clearPassword, this.passwordHash);
    }
}
