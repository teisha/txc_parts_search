'use strict';
const User = require('../models/user');
const user = jest.genMockFromModule('../models/user');


user.fakeDb = new Map();
const user1 = new User(1, 'testuser', 'Maark', 'Component', 'component@co.com', '5551234567','');
user1.setPassword('pwd');
user.fakeDb.set(1, user1 );


user.saveLoginHistory = jest.fn().mockImplementation( (sessionId) => {
  user.loginSession = sessionId;
});

User.findById = jest.fn().mockImplementation( (id) => {
		user.fakeDb.get(id);
	});

module.exports = user;