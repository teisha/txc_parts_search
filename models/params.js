const db = require('../util/database');
module.exports = class Params {

  static fetchAll() {
    return db.execute('SELECT  * FROM  local_processing_parameters');
  }
}