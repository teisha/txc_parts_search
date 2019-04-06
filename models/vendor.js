const db = require('../util/database');

module.exports = class Vendor {
  constructor(vendorId, vendorShortName, VendorName, isChannelOnline) {
    this.id = vendorId;
    this.vendorShortName = vendorShortName;
    this.VendorName = VendorName;
    this.isChannelOnline = isChannelOnline;
  }


  static fetchAllVendors(id) {
    return db.execute('SELECT * FROM vendor_import_params vip '+ 
           ' INNER JOIN vendors v ON vip.vendor_id = v.vendor_id '+ 
           ' ORDER BY v.vendor_id ' );
  }

  static findById(id) {
    return db.execute('SELECT * FROM vendors WHERE vendor_id = ?', [id]);
  }
};
