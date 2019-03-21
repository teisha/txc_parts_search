const mysql = require('mysql2');
const debug = require('debug');

try {
	console.log("Pool created with parameters: \nhost: " + process.env.MYSQL_HOST +
		       "\nuser: " + process.env.MYSQL_USER +
	           "\npassword: " + process.env.MYSQL_PASSWORD +
	           "\nschema: " + process.env.MYSQL_SCHEMA);
	const pool = mysql.createPool({
	    host: 'localhost',
	    user: process.env.MYSQL_USER,
	    database: process.env.MYSQL_SCHEMA,
	    password: process.env.MYSQL_PASSWORD
	});
	module.exports = pool.promise();

} catch (e) {
	debug(1, "error while trying to create account:", e)
    res.status(500).end("Internal Server Error")
}
