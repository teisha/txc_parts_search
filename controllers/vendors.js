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
