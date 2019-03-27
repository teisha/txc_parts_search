const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render ('auth/login', {
         path: '/login',
         pageTitle: "Login",
         isAuthenticated: false
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('1')
	  .then(user => {
		req.session.isLoggedIn = true;
		req.session.user = user;
		req.session.save(err => {
			console.log(err);
			res.redirect('/index');
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




// var bcrypt = require('bcrypt');

// exports.cryptPassword = function(password, callback) {
//    bcrypt.genSalt(10, function(err, salt) {
//     if (err) 
//       return callback(err);

//     bcrypt.hash(password, salt, function(err, hash) {
//       return callback(err, hash);
//     });
//   });
// };

// exports.comparePassword = function(plainPass, hashword, callback) {
//    bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
//        return err == null ?
//            callback(null, isPasswordMatch) :
//            callback(err);
//    });
// };

