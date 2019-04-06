const db = require('../util/database');
module.exports = class VendorService {

  static fetchAllVendors(id) {
    return db.execute('SELECT vip.*, '+
    	   ' v.vendor_short_name, v.vendor_name, ' +
    	   ' IF(is_load_activated = 1,1,0 ) as is_active_toint, ' +
    	   ' IF(has_etilize_data = 1,1,0 ) as is_etilize_toint, ' +
    	   ' IF(is_manual_load = 1,1,0 ) as is_manual_toint, ' +
    	   ' IF(is_channelonline_compatible = 1,1,0 ) as is_channelonline_toint ' +
    	   ' FROM vendor_import_params vip '+ 
           ' INNER JOIN vendors v ON vip.vendor_id = v.vendor_id '+ 
           ' ORDER BY v.vendor_id ' );
  }

  static findById(id) {
    return db.execute('SELECT * FROM vendors WHERE vendor_id = ?', [id]);
  }
}