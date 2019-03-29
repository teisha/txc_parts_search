const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
	let errorMessage = req.flash('error');
	res.render ('auth/login', {
         path: '/login',
         pageTitle: "Login",
         errorMessage: getSingleErrorMessage(errorMessage)
	});
};

exports.postLogin = (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;	
	if (!username || !password) {
		req.flash('error', 'Please enter username and password to log in.');
		return res.redirect('/login');
	}
bcrypt.hash(password, 12).then (pwd => console.log(pwd));	

	User.findByUserName(username)
	  .then( ([rows, fieldData]) => {
	  	let userData = rows[0];
console.log("Found User: " + userData.user_id + ", " + userData.username + ", " + userData.user_password);	  	
	  	if (!userData || userData.username === undefined) {
	  		req.flash('error', 'Invalid email or password.');
	  		return res.redirect('/login');
	  	}
	  	bcrypt
	  		.compare(password, userData.user_password)
	  		.then( isMatch => {
	  			if (isMatch) {
	  				let user = new User (userData.user_id, 
			    		userData.username, 
			    		userData.first_name, 
			    		userData.last_name,
			    		userData.email, 
			    		userData.phone_number, 
			    		userData.phone_extension
		    		);
		    		console.log("User IS LOGGED IN: " + JSON.stringify(user));
					req.session.isLoggedIn = true;
					req.session.user = user;
					return req.session.save(err => {
						if (err) console.log(err);
						res.redirect('/index');
					});
	  			}
	  			req.flash('error','Invalid email or password');
	  			return res.redirect('/login');
	  		} )
	  		.catch (err => {
	  			console.log(err);
	  			res.redirect('/login');
	  		});
	  })
	  .catch(err => console.log(err) );
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};


getSingleErrorMessage = function(message) {
	if (message.length > 0) {
    	message = message[0];
  	} else {
    	message = null;
  	}
  	return message;
}




// cryptPassword = function(password, callback) {
//    bcrypt.genSalt(10, function(err, salt) {
//     if (err) 
//       return callback(err);

//     bcrypt.hash(password, salt, function(err, hash) {
//       return callback(err, hash);
//     });
//   });
// };

// comparePassword = function(plainPass, hashword, callback) {
//    bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
//        return err == null ?
//            callback(null, isPasswordMatch) :
//            callback(err);
//    });
// };

