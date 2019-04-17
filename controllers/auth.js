'use strict';
const User = require('../models/user');
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const { getSingleErrorMessage } = require('../util/common.js');

exports.getLogin = (req, res, next) => {
	let errorMessage = req.flash('error');
	res.status(200).render ('auth/login', {
         path: '/login',
         pageTitle: "Login",
         errorMessage: getSingleErrorMessage(errorMessage)
	});
};

exports.postLogin = async (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;	
	if (!username || username === undefined || 
		!password || password === undefined) {
		req.flash('error', 'Please enter username and password to log in.');
		return res.status(422).redirect('/login');
	}

//await bcrypt.hash(password, 12).then (pwd => console.log(pwd));

	try {		
		const [rows, fieldData] = await userService.findByUserName(username);
		let userData = rows[0];
// console.log("Found User: " + userData.user_id + ", " + userData.username );		
		if (!userData || userData.username === undefined) {
  			req.flash('error', 'Invalid email or password.');
  			return res.status(422).redirect('/login');
  		}

		try {
			let isMatch = await bcrypt.compare(password, userData.user_password);
			if (isMatch) {
		  		let user = new User(userData.user_id, 
	    			userData.username, 
	    			userData.first_name, 
	    			userData.last_name,
	    			userData.email, 
	    			userData.phone_number, 
	    			userData.phone_extension
				);
				req.session.isLoggedIn = true;
				req.session.user = user;
					
				return  req.session.save(err => {
					if (err) console.log("ERROR SAVING SESSION" + err);
					req.session.user.saveLoginHistory(req.sessionID);
					res.status(200).redirect('/index');
				});
			}
		} catch (err) {
	  		console.log("BCRYPT ERROR ON COMPARE: " + err);
	  		res.status(422).redirect('/login');
		}


	} catch (err1) {
		console.log("ERROR looking up user: " + username + ': ' + err1);
		req.flash('error', 'Could not log in user.  Please try again later.');
		return res.status(500).redirect('/login');
	}
	
	req.flash('error','Invalid email or password');
	return res.status(422).redirect('/login');
	  		

//	  })
//	  .
	return;  
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};







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

