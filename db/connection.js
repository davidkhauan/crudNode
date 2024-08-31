const mySQL = require ('mysql')

const POOL = mySQL.createPool ({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
})

module.exports = POOL