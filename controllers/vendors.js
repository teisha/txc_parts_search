'use strict';
const Vendor = require('../services/vendorService');

exports.viewVendors = (req, res, next) => {
  console.log("fetching vendors");
  Vendor.fetchAllVendors()
    .then(([rows, fieldData]) => {
      res.render('vendor/vendors-main', {
        params: rows,
        pageTitle: 'Vendor Information',
        path: '/vendors',
      });
    })
    .catch(err => console.log(err));
};



exports.showVendorHistory = (req, res, next) => {
  const vendorId = req.params.vendorId;
  console.log("fetching vendor history for: " + vendorId);
  Vendor.getProcessHistoryDetailsByVendor(vendorId)
    .then(([rows, fieldData]) => {
      res.render('vendor/vendor-history', {
        params: rows,
        pageTitle: 'Vendor History',
        path: '/vendors',
      });
    })
    .catch(err => console.log(err));
};