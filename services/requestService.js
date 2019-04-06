const db = require('../util/database');
module.exports = class RequestService {

	static fetchAllRequests() {
		return db.execute('SELECT  *  ' + 
			             ' FROM  user_requests ur ' + 
			             '   INNER JOIN user_request_categories urc ON ' + 
			             '      ur.category_type_id = urc.category_type_id ' +
			             ' ORDER BY user_request_id DESC ' +
			             ' LIMIT 30');
	}

	static addRequests(category, request, username, userid) {
		const sqlString = ' INSERT INTO user_requests (category_type_id, ' +
         ' request_text, created_by, user_id ) ' + 
         ' SELECT category_type_id, ?, ?, ? ' +
         ' FROM user_request_categories ' + 
         ' WHERE category_type = ? ';
    	return db.execute(sqlString,[request, username, userid, category]);
	}



}