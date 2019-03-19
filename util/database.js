const mysql = require('mysql2');

try {
	const pool = mysql.createPool({
	    host: 'localhost',
	    user: 'txc_app_user',
	    database: 'txc_inventory',
	    password: 'viewtxc8554957'
	});
	module.exports = pool.promise();

} catch (e) {
	debug(1, "error while trying to create account:", e)
    res.status(500).end("Internal Server Error")
}
