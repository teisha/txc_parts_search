"use strict";
const authMiddleware = require('../../middleware/validateAuthentication');


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Middleware', () => {
  test('redirects if not logged in', (done) => {
  	const req =  {
  		session: {}
  	};
  	let res = mockResponse();
  	console.log (JSON.stringify(req));
    console.log(JSON.stringify(res));

	authMiddleware(req, res, () => {});
    done(); 
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.redirect).toHaveBeenCalledWith('/login');
    console.log(window.location.href);
    
  });


  test('allows next() if session isLoggedIn', (done) => {
  	const req = {
  		session: {isLoggedIn: true}
  	};
  	const calledNext = jest.fn().mockReturnValue(true);
  	let res = mockResponse();
  	console.log("IsLoggedIn: " + req.session.isLoggedIn);

  	authMiddleware(req, res, () => {calledNext();});
  	done();

  	expect(res.status).not.toHaveBeenCalled();
  	expect(calledNext).toHaveBeenCalled();
  })
});