const Params = require('../models/params');


exports.selectParams = (req, res, next) => {
  Params.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('admin/loader-params-list', {
        params: rows,
        pageTitle: 'Loader Params',
        path: '/admin/parameters',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};


