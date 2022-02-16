import {createConnection, Connection} from "typeorm";
import { db } from '../config';

const connection = createConnection({
    type: "mysql",
    host: db.host,
    port: Number(db.port),
    username: db.user,
    password: db.password,
    database: db.name,
    entities: [
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