const db = require('../util/database');

module.exports = class Vendor {
  constructor(vendorId, vendorShortName, VendorName, isChannelOnline) {
    this.id = vendorId;
    this.vendorShortName = vendorShortName;
    this.VendorName = VendorName;
    this.isChannelOnline = isChannelOnline;
  }


  static findById(id) {
    return db.execute('SELECT * FROM vendors WHERE vendor_id = ?', [id]);
  }
};
