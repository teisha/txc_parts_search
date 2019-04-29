'use strict';
const db = require('../util/database');
module.exports = class LoaderParameterService {

  static fetchAllGenericProcessingParameters() {
    return db.execute('SELECT  * FROM  local_processing_parameters');
  }

  static fetchAllVendorLoaderParameters() {
    return db.execute('SELECT  * FROM  vendor_import_params');
  }
  static fetchAllVendorRealtimeParameters() {
    return db.execute('SELECT  * FROM  vendor_realtime_params');
  }  

  static fetchAllMarkupValues() {
    const sqlstring = 'SELECT  multiplier,  mt.upper_limit_price, ' +
      '  (SELECT upper_limit_price + 1 FROM markup_table  ' + 
      '   WHERE upper_limit_price < IF( mt.upper_limit_price = -1, 9999999999, mt.upper_limit_price) ' + 
      '   ORDER BY upper_limit_price DESC LIMIT 1) AS begin_range ' + 
                    '  FROM  markup_table mt ' + 
                    '  ORDER BY CASE upper_limit_price ' + 
                    '  WHEN -1 THEN 9999999999 ' + 
                    '  ELSE upper_limit_price ' + 
                    '  END ';
//    console.log(sqlstring);                    
    return db.execute(sqlstring);
  } 
}