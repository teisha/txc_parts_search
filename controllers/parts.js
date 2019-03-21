const Part = require('../models/part');

exports.getIndex = (req, res, next) => {
  console.log("Connected to website");
  res.redirect('/list-parts');
}

exports.getParts = (req, res, next) => {
  const offset = 0;
  const limit = 20;
  fetchAll(offset, limit, res);
};

function fetchAll(offset, limit, res)  {
   Part.fetchAll(limit, offset)
    .then(([rows, fieldData]) => {
      res.render('part/part-list', {
        parts: rows,
        offset: offset,
        limit: limit,
        searchValue: "",
        pageTitle: 'All Parts',
        path: '/parts'
      });
    })
    .catch(err => console.log(err));
}

exports.getPreviousParts = (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset) - limit;
  if (offset < 0) {
    offset = 0;
  }
  console.log ("Getting " + req.query.offset + " to " + offset);
  fetchAll(offset, limit, res);
}

exports.getNextParts = (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset) + limit;
  console.log ("Getting " + req.query.offset + " to " + offset);
  fetchAll(offset, limit, res);
}

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


exports.searchParts = (req, res, next) => {
  const offset = 0;
  const limit = 20;
  const searchValue = req.body.searchParameter;
  console.log("Running query for search parameter: " + searchValue)
  Part.findMatching(limit, offset, searchValue)
    .then(([rows, fieldData]) => {
      res.render('part/part-list', {
        parts: rows,
        offset: offset,
        limit: limit,
        searchValue: searchValue,
        pageTitle: 'Parts Matching: "' + searchValue +'"',
        path: '/parts'
      });
    })
    .catch(err => console.log(err));
};

