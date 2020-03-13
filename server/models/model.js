const { Pool } = require('pg');
const PG_URI = "postgres://smabkvvq:Ne2hS2gi8ux0ykfPK0SDrHniW8_Ci2A5@drona.db.elephantsql.com:5432/smabkvvq";

const pool = new Pool({
    connectionString: PG_URI
});


module.exports = {
    query: ( text, params, callback ) => {
        return pool.query(text, params, callback)
    }
}