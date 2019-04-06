const Params = require('../services/loaderParameterService');
const History = require('../services/historyService');
const UserService = require('../services/userService');
const RequestService = require('../services/requestService');


exports.viewGenericLoaderParams = (req, res, next) => {
  Params.fetchAllGenericProcessingParameters()
    .then(([rows, fieldData]) => {
      res.render('admin/loader/loader-params-list', {
        params: rows,
        pageTitle: 'Loader Params (Generic)',
        path: '/admin/parameters',
      });
    })
    .catch(err => console.log(err));
};

exports.viewMarkupLoaderParams = (req, res, next) => {
  Params.fetchAllMarkupValues()
    .then(([rows, fieldData]) => {
      res.render('admin/loader/markup-values', {
        params: rows,
        pageTitle: 'Loader Params (List Price Markup)',
        path: '/admin/parameters',
      });
    })
    .catch(err => {
    	console.log(err);
    	req.flash("error", "Could not load markup values.")
		return res.status(500).redirect('/show-loader-params');
 	});

};

exports.viewLoaderHistory = async (req, res, next) => {
	try {
		const [loaderSummary, fieldData] = await History.getProcessHistory();
		const [loaderDetails, metaData] = await History.getProcessHistoryDetails();
		res.render('admin/loader/history', {
	        params: { loaderSummary, loaderDetails },
	        pageTitle: 'Loader History',
	        path: '/admin/parameters',
      });
	} catch (err) {
		console.log(err);
		req.flash("error", "Could not load processing history.")
		return res.status(500).redirect('/show-loader-params');
	}
};

exports.viewWebUsers = async (req, res, next) => {
	try {
		const [users, fieldData] = await UserService.fetchAllUsers();
		res.render('admin/web/user-admin', {
	        params: users,
	        pageTitle: 'Web Users',
	        path: '/admin/parameters',
      });
	} catch (err) {
		console.log(err);
		req.flash("error", "Could not load users.")
		return res.status(500).redirect('/show-loader-params');
	}
};

exports.getRequest = async (req, res, next) => {
	const errorMessage = req.flash("error");
	const infoMessage = req.flash("info");
	const [requests, fieldData] = await RequestService.fetchAllRequests();
    res.render('admin/requests/user-requests', {
        params: requests,
        pageTitle: 'Submit Request',
        path: '/admin/parameters',
        errorMessage: getSingleErrorMessage(errorMessage),
        infoMessage: getSingleErrorMessage(infoMessage)
    });
};

exports.postRequest = async(req, res, next) => {
	const user = req.session.user;
	const requestText = req.body.request;
	const categoryName = req.body.categoryName;
	try {
      await RequestService.addRequests(categoryName, requestText, user.userName, user.id);
      req.flash("info", "Request added successfully");
      return res.status(200).redirect('/admin/requests');
	} catch (err) {
		console.log(err);
		req.flash("error", "Could not log request.")
		return res.status(500).redirect('/admin/requests');
	}
}

exports.showLoaderParams = (req, res, next) => {
	let errorMessage = req.flash('error');
    res.render('admin/loader/chose-params', {
        params: {},
        pageTitle: 'Loader Params',
        path: '/admin/parameters',
        errorMessage: getSingleErrorMessage(errorMessage)
    });
};


