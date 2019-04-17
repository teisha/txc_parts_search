module.exports = {
	getSingleErrorMessage : function(message) {
		if (message && message.length > 0) {
	    	message = message[0];
	  	} else {
	    	message = null;
	  	}
	  	return message;
	}
}