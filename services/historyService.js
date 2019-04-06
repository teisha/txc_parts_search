const db = require('../util/database');
module.exports = class HistoryService {

	static fetchAllVendorRealtimeParameters() {
		return db.execute('SELECT  * FROM  vendor_realtime_params');
	}

	static getProcessHistory() {
		console.log("GET LAST 10 process history summary");
		return db.execute('SELECT * FROM process_log ORDER BY process_start_date DESC LIMIT 10 ');
	}

	static getProcessHistoryDetails() {
		console.log("GET LAST 10 process history detail");
		return db.execute('SELECT * ' +
			' FROM ' +
			' (SELECT log_id FROM process_log ORDER BY process_start_date DESC LIMIT 10) p ' +
			' INNER JOIN import_history ih ' +
			' ON p.log_id = ih.log_id ' +
			' ORDER BY p.log_id, vendor_id ');
	}

	static getProcessHistoryDetailsByVendor(vendorId) {
		console.log("GET LAST 20 process history for vendor: " + vendorId);
		return db.execute('SELECT * ' +
			' FROM JOIN import_history ih ' +
			' WHERE vendor_id = ? ' +
			' ORDER BY p.log_id DESC ' + 
			' LIMIT 20 ', [vendorId]);
	}

}