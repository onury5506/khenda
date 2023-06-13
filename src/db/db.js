import KNEX from 'knex';
import initTables from './tables/index.js'

const knex = KNEX({
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_CONNECTION,
        port: 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }
});

initTables(knex)

export default knex
