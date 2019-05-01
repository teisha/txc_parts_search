'use strict';
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


	static getRecordSummary() {
		console.log("GET process data counts");
		return db.execute('SELECT v.vendor_name, pdc.* ' +
			' FROM processed_data_counts pdc ' + 
			'   INNER JOIN vendors v ON ' +
            '     pdc.vendor_id = v.vendor_id ' +
			' ORDER BY pdc.vendor_id');
	}


    static getLastLoadSummary() {
    	const sqlString = " SELECT log_id, vendor_name, load_start_time, " +
			"      TIMESTAMPDIFF(MINUTE,load_start_time,load_end_time) AS duration, " +
			"      load_status, record_count, message  " +
			"    FROM import_history WHERE log_id = (SELECT log_id  " +
			"                FROM process_log ORDER BY log_id DESC LIMIT 1)  " +
			"    ORDER BY log_id DESC, vendor_id ";
//			console.log(sqlString);
		return db.execute (sqlString);
	}

}