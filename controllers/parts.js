const Part = require('../models/part');

exports.getParts = (req, res, next) => {
  Part.fetchAll(20, 0)
    .then(([rows, fieldData]) => {
      res.render('part/part-list', {
        parts: rows,
        pageTitle: 'All Parts',
        path: '/parts'
      });
    })
    .catch(err => console.log(err));
};

exports.getPart = (req, res, next) => {
  const partId = req.params.partId;
  Part.findById(partId)
    .then(([part]) => {
      res.render('part/part-detail', {
        part: part[0],
        pageTitle: part.vendor_sku,
        path: '/parts'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  console.log("Connected to website");
  res.redirect('/list-parts');
}