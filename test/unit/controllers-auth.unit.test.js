"use strict";
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const authController = require('../../controllers/auth');

jest.mock('mysql2', function() {});

const User = require('../../models/user');
const fakeDb = [
    {user_id:1, username:'testuser', first_name:'Maark', last_name:'Component', 
	  email:'component@co.com', phone_number:'5551234567',phone_extension:'',
	  user_password:'$2a$12$juObFQM63J0yTfeidegoduhNKC2QozbG6MGYgzp8.muSnoDLtxLsW'},
	  {user_id:1, username:'secondtestuser', first_name:'Stewey', last_name:'Element', 
	  email:'element@co.com', phone_number:'5557654321',phone_extension:'27',
	  user_password:'does not match'}
];
User.findByUserName = jest.fn().mockImplementation( (name) => {
	  let fakeUser = fakeDb.find(function(userrec) {  
	    	return userrec.username === name;
		});
	    console.log("MOCK - FIND USER: " + JSON.stringify(fakeUser) );
		return Promise.resolve([[fakeUser],{}]);
});

const mockSaveLoginHistory = jest.fn().mockImplementation( (sessionId) => {
	    	console.log("MOCK SAVE HISTORY: " + sessionId);
	    	return Promise.resolve([{},{}]);
		});




const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn((urlPassed, paramsPassed) => {
  	res.url = urlPassed;
  	res.params = paramsPassed;
  });
  return res;
};

const mockRequest = () => {
   const req = {
   	  sessionID : 12356,
   	  body : {},
   	  session : {
   	  	save : jest.fn().mockImplementation(func => {
   	  		func()
   	  	})
   	  },
   	  flashVal : new Map()
   };

   return req;
};
let req ;



describe('Auth controller => getLogin', () => { 
  beforeEach(() => {
  	req = mockRequest();
    req.flash = jest.fn().mockImplementation((flashType) => {
   					return [req.flashVal.get(flashType)]; 
   				});
  });

  test('getLogin renders error message if passed', async () => {
  	req.flashVal.set("error", 'You got an error');
    let res = mockResponse();

    await authController.getLogin(req, res, () => {}); 
  	console.log("GETLOGIN RES:" + JSON.stringify(res));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.url).toEqual('auth/login');
    expect(res.params.path).toEqual('/login');
    expect(res.params.pageTitle).toEqual("Login");
    expect(res.params.errorMessage).toEqual("You got an error");
  });

  test('getLogin renders no error message if none generated', async () => {
    let res = mockResponse();

    await authController.getLogin(req, res, () => {}); 
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.url).toEqual('auth/login');
    expect(res.params.path).toEqual('/login');
    expect(res.params.pageTitle).toEqual("Login");
    expect(res.params.errorMessage).toEqual(undefined);
  });  
});	


   
describe('Auth controller => postLogin', () => { 
	beforeAll(() => {
		User.prototype.saveLoginHistory = mockSaveLoginHistory;
	}) ;
  beforeEach(() => {
  	req = mockRequest();
    req.flash = jest.fn().mockImplementation((flashType, flashValue) => {
   					req.flashVal.set(flashType, flashValue);
   					console.log(req.flashVal); 
   				});
  });

  test('postLogin redirects with error ', async () => {
  	let res = mockResponse();

	await authController.postLogin(req, res, () => {}); 

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.redirect).toHaveBeenCalledWith('/login');
  })

  test('postLogin redirects back to login page when password doesnt match', async () => {
	req.body.username = 'secondtestuser';
	req.body.password = 'does not match'; 
	let res = mockResponse();

	await authController.postLogin(req, res, () => {});
	console.log("POSTLOGIN: RES: " + JSON.stringify(res));
	console.log("POSTLOGIN: REQ: " + JSON.stringify(req));

	expect(res.status).toHaveBeenCalledWith(422);
	expect(res.redirect).toHaveBeenCalledWith('/login');
	expect(req.flashVal.get('error') ).toBe('Invalid email or password');
  });

  test('postLogin redirects back to login page when user is not found', async () => {
	req.body.username = 'undefineduser';
	req.body.password = 'undefinedpassword'; 
	let res = mockResponse();

	await authController.postLogin(req, res, () => {});
	console.log("POSTLOGIN: RES: " + JSON.stringify(res));
	console.log("POSTLOGIN: REQ: " + JSON.stringify(req));

	expect(res.status).toHaveBeenCalledWith(422);
	expect(res.redirect).toHaveBeenCalledWith('/login');
	expect(req.flashVal.get('error') ).toBe('Invalid email or password.');
  });  

  test('postLogin sets user on session, saves history and redirects to index ', async () => {
	req.body.username = 'testuser';
	req.body.password = 'testpassword'; 
	let res = mockResponse();

	await authController.postLogin(req, res, () => {});

// for (let key in req.session.user) {
//     console.log(req.session.user.constructor.name + " / " + key + ": " + req.session.user[key]);
//   }
// console.log(Object.getPrototypeOf(req.session.user));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.redirect).toHaveBeenCalledWith('/index');

    expect(req.session.isLoggedIn).toBeTruthy();
    expect(req.session.user).toBeInstanceOf(User);
    expect(req.session.user.userName).toBe('testuser');
    expect(req.session.user.firstName).toBe('Maark');
    expect(req.session.user.lastName).toBe('Component');
    expect(req.session.user.email).toBe('component@co.com');
    expect(req.session.user.phoneNumber).toBe('5551234567');
    expect(req.session.user.phoneExtension).toBe('');
    expect(mockSaveLoginHistory).toHaveBeenCalled();
     
  });







  afterAll(() => {
	user.prototype.saveLoginHistory = null;
  }) ;
});





// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}