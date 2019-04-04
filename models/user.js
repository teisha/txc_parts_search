const db = require('../util/database');

module.exports = class User {
  constructor(userId, userName, firstName, lastName, email, phoneNumber, phoneExtension) {
    this.id = userId;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.phoneExtension = phoneExtension;
  }

  setPassword(pwd) {
    this.password = pwd;
  }


  saveLoginHistory(sessionId) {
    const sqlString = ' INSERT INTO user_login_activity (user_id, username, ' +
         ' session_id ) VALUES (?, ?, ?) ';
    return db.execute(sqlString,[this.id, this.userName, sessionId]);
  }

  static findById(id) {
    return db.execute('SELECT * FROM users WHERE user_id = ?', [parseInt(id)]);
  }


  static findByUserName(name) {
     // db.execute('SELECT * FROM users WHERE username = ?',[name.trim()]).
     //    then ( user => console.log(user));  
      return db.execute('SELECT * FROM users WHERE username = ?',[name.trim()]);
  }

};
