'use strict';
const db = require('../util/database');

module.exports = class Vendor {
  constructor(vendorId, vendorShortName, VendorName, isChannelOnline) {
    this.id = vendorId;
    this.vendorShortName = vendorShortName;
    this.VendorName = VendorName;
    this.isChannelOnline = isChannelOnline;
  }

};
