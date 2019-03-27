const db = require('../util/database');

module.exports = class User {
  constructor(userId, userName, firstName, lastName, phoneNumber, phoneExtension) {
    this.id = userId;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.phoneExtension = phoneExtension;
  }


  static findById(id) {
    return db.execute('SELECT * FROM users WHERE user_id = ?', [parseInt(id)]);
  }
};
