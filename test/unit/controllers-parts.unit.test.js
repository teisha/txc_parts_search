'use strict';
const partsController = require('../../controllers/parts');
const PartService = require('../../services/partService');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

jest.mock('mysql2', function() {});

const returnAllVal = {manufacturer_id: 1, vendor_id: 1, parts_inventory_id:1, products_model:"MODEL",
		part_number : "T3Y36FDEBH",  vendor_sku: "SKU4356", quantity: 25, 
		cost: 76, weight: 347, part_name:"Name Of Part", 
		part_description:"You know nothing, John Snow", condition_indicator:1, 
		msrp: 99.66, listed_price: 80, etilize_id:0, date_loaded: new Date(), 
		vendor_short_name: "EDU", vendor_name:"JEST EDUCATION", 
		is_channelonline_compatible:"N", manufacturer_name:"Groovy", 
		manufacturer_code:"GRU", etilize_mfg_id: 14};
const returnMatchingVal = {manufacturer_id: 2, vendor_id: 2, parts_inventory_id:2, 
	    products_model:"PRODUCTSMODEL", part_number : "T3Y36PARTNOMATCH",  
	    vendor_sku: "MATCHSKU4356", quantity: 15, 
		cost: 46, weight: 7, part_name:"Matching Part", 
		part_description:"Time And Money", condition_indicator:0, 
		msrp: 77.66, listed_price: 60, etilize_id:12234, date_loaded: new Date(), 
		vendor_short_name: "MRE", vendor_name:"JEST MATCH", 
		is_channelonline_compatible:"Y", manufacturer_name:"Axe", 
		manufacturer_code:"AXE", etilize_mfg_id: 564564};		

const mockPopulateVendors = jest.fn().mockReturnValue(true);
partsController.populateVendors = mockPopulateVendors;



PartService.fetchAll = jest.fn().mockImplementation( (limit, offset) => {
	    console.log ("MOCK FETCH ALL");
        return Promise.resolve([[returnAllVal],{}]); 
	});

PartService.findMatching = jest.fn().mockImplementation( (limit, offset, searchValue, searchType, vendorSelected, searchManufacturer) => {
		console.log ("MOCK FETCH MATCHING");
        return Promise.resolve([[returnMatchingVal],{}]);

	});
//PartService.prototype.findMatching = mockfindMatching;

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
   	  	user : {},
   	  	save : jest.fn().mockImplementation(func => {
   	  		func()
   	  	})
   	  },
   	  flashVal : new Map()
   };
   req.session.user.userName = "jest";
   return req;
};
let req = mockRequest();
const res = mockResponse();


describe('Parts controller => MATCH search terms', () => { 
  beforeEach(() => {
  	req = mockRequest();
  	req.body.limit = 20;
	req.body.offset = 0;
	req.flash = jest.fn().mockImplementation((flashType, flashValue) => {
   		req.flashVal.set(flashType, flashValue);
   		console.log(req.flashVal);  
   	});
  });


  test('searchParts calls fetchMatching when vendorID populated', async () => {
    req.body.searchType = 1;
    req.body.searchParameter = "search";
    req.body.searchManufacturer = "";
    req.body.vendorSelected = 1;
    await partsController.searchParts(req, res, () => {}); 

    expect(PartService.findMatching).toHaveBeenCalled();
    expect(PartService.fetchAll).not.toHaveBeenCalled();
    expect(res.url).toEqual('part/part-list');
    expect(res.params.path).toEqual('/parts');
    expect(res.params.pageTitle).toEqual('Parts Matching: "search"');
    expect(res.params.limit).toBe(50);
    expect(res.params.offset).toBe(0);
    expect(res.params.searchType).toBe(1);
    expect(res.params.searchValue).toBe("search");
    expect(res.params.searchManufacturer).toBe("");
    expect(res.params.vendorSelected).toBe(1);
  });


  test('searchParts redirects to parts list if parameters passed incorrectly', async () => {
    req.body.searchType = 1;
    req.body.searchParameter = "";
    req.body.searchManufacturer = "";
    req.body.vendorSelected = 1;
    await partsController.searchParts(req, res, () => {}); 
    
    expect(PartService.findMatching).toHaveBeenCalled();
    expect(PartService.fetchAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(307);
    expect(res.redirect).toHaveBeenCalledWith('/list-parts');
    expect(res.url).toEqual("part/part-list");
    expect(req.flashVal.get('error') ).toBe('Search term is required to use "Advanced Search" feature.');
  });


  test('getNextParts calls fetchMatching when vendorID populated', async () => {
    req.body.searchType = 2;
    req.body.searchValue = "next search - increment";
    req.body.searchManufacturer = "Manufac";
    req.body.vendorSelected = 1;
    await partsController.getNextParts(req, res, () => {}); 

    expect(PartService.findMatching).toHaveBeenCalled();
    expect(PartService.fetchAll).not.toHaveBeenCalled();
    expect(res.url).toEqual('part/part-list');
    expect(res.params.path).toEqual('/parts');
    expect(res.params.pageTitle).toEqual('Parts Matching: "next search - increment"');
    expect(res.params.limit).toBe(20);
    expect(res.params.offset).toBe(20);
    expect(res.params.searchType).toBe(2);
    expect(res.params.searchValue).toBe("next search - increment");
    expect(res.params.searchManufacturer).toBe("Manufac");
    expect(res.params.vendorSelected).toBe(1);
    expect(req.flashVal.get('error') ).toBeUndefined();
  });

  test('getNextParts requires search paramteres for advanced search', async () => {
    req.body.searchType = 1;
    req.body.searchParameter = "";
    req.body.searchManufacturer = "";
    req.body.vendorSelected = 1;
    await partsController.getNextParts(req, res, () => {}); 
    
    expect(PartService.findMatching).toHaveBeenCalled();
    expect(PartService.fetchAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(307);
    expect(res.redirect).toHaveBeenCalledWith('/list-parts');
    expect(res.url).toEqual("part/part-list");
    expect(req.flashVal.get('error') ).toBe('Search term is required to use "Advanced Search" feature.');
  });

  test('getPreviousParts calls fetchMatching when vendorID populated', async () => {
    req.body.searchType = 3;
    req.body.searchValue = "back search - decrement";
    req.body.searchManufacturer = "Turer";
    req.body.vendorSelected = 25;
    req.body.limit = 50;
    req.body.offset = 130;
    await partsController.getPreviousParts(req, res, () => {}); 

    expect(PartService.findMatching).toHaveBeenCalled();
    expect(PartService.fetchAll).not.toHaveBeenCalled();
    expect(res.url).toEqual('part/part-list');
    expect(res.params.path).toEqual('/parts');
    expect(res.params.pageTitle).toEqual('Parts Matching: "back search - decrement"');
    expect(res.params.limit).toBe(50);
    expect(res.params.offset).toBe(80);
    expect(res.params.searchType).toBe(3);
    expect(res.params.searchValue).toBe("back search - decrement");
    expect(res.params.searchManufacturer).toBe("Turer");
    expect(res.params.vendorSelected).toBe(25);
    expect(req.flashVal.get('error') ).toBeUndefined();
  });

  test('getPreviousParts requires search paramteres for advanced search', async () => {
    req.body.searchType = 1;
    req.body.searchParameter = "";
    req.body.searchManufacturer = "";
    req.body.vendorSelected = 1;
    await partsController.getPreviousParts(req, res, () => {}); 
    
    expect(PartService.findMatching).toHaveBeenCalled();
    expect(PartService.fetchAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(307);
    expect(res.redirect).toHaveBeenCalledWith('/list-parts');
    expect(res.url).toEqual("part/part-list");
    expect(req.flashVal.get('error') ).toBe('Search term is required to use "Advanced Search" feature.');
  });

  afterAll(() => {
	console.log("DONE");
  }) ;
});  
