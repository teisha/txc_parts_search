const db = require('../util/database');
module.exports = class UserService {
	static findById(id) {
    	return db.execute('SELECT * FROM users WHERE user_id = ?', [parseInt(id)]);
  	}


  static findByUserName(name) {
     // db.execute('SELECT * FROM users WHERE username = ?',[name.trim()]).
     //    then ( user => console.log(user));  
      return db.execute('SELECT * FROM users WHERE username = ?',[name.trim()]);
  }

  static fetchAllUsers(name) {
      return db.execute('SELECT * FROM users');
  }
}
