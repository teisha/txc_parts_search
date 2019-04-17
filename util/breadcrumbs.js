module.exports = {
	collect : function(req) {
		if (!req.session.breadcrumbs) {
			req.session.breadcrumbs = [];
		}
		const breadcrumb = {
			url: req.originalUrl,
			method: req.method,
			body: req.body,
			params: req.params,
			query: req.query
		}
		req.session.breadcrumbs.unshift(breadcrumb);
		if (req.session.breadcrumbs.length > 5) {
			req.session.breadcrumbs.pop();
		}

console.log('-- BC --');
		// console.log("BREADCRUMBS: " + JSON.stringify(req.session.breadcrumbs));
	}
}