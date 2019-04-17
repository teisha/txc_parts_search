'use strict';
const PartService = require('../services/partService');
const VendorService = require('../services/vendorService');
const http = require('http');
const request = require('request');
const { getSingleErrorMessage } = require('../util/common.js');

const allVendorMap = new Map();

const populateVendors = async () => {
  if (allVendorMap.size === 0) {
    const [vendors, metadata] = await VendorService.fetchAllVendors();
    vendors.forEach(vendor => {
      allVendorMap.set(vendor.vendor_id, vendor.vendor_name);
    });
    allVendorMap.forEach( (value, key) => {
      console.log(`m[${key}] = ${value}`);
    });
  }
} 

exports.getIndex = (req, res, next) => {
  console.log("Connected to website");
  res.redirect('/list-parts');
}

exports.getParts = (req, res, next) => {
  populateVendors();
  const offset = 0;
  const limit = 20;
  fetchAll(offset, limit, req, res);
};


exports.searchParts = (req, res, next) => {
  // console.log('controller.searchParts-body: ' + JSON.stringify(req.body));
  const offset = 0;
  const limit = 50;
  const searchType = req.body.searchType;
  const searchValue = req.body.searchParameter;
  const vendorSelected = req.body.vendorSelected;
  const searchManufacturer = req.body.searchManufacturer;

  console.log(req.session.user.userName + ": Running query for search parameter: " + searchValue)
  scroll(limit, offset, searchType, searchValue, vendorSelected, searchManufacturer, req, res);
};


exports.getPreviousParts = (req, res, next) => {
  const limit = parseInt(req.body.limit);
  let offset = parseInt(req.body.offset) - limit;
  if (offset < 0) {
    offset = 0;
  }
  const searchType = req.body.searchType;
  const searchValue = req.body.searchValue;
  const vendorSelected = req.body.vendorSelected;
  const searchManufacturer = req.body.searchManufacturer;
  // console.log ("BODY-PREVIOUS searchType: " + searchType + " searchValue: " + searchValue);
  scroll(limit, offset, searchType, searchValue, vendorSelected, searchManufacturer, req, res);
}

exports.getNextParts = (req, res, next) => {
  // console.log("NEXT PARTS - REQUEST BODY: " + JSON.stringify(req.body));
  const limit = parseInt(req.body.limit);
  const offset = parseInt(req.body.offset) + limit;
  const searchType = req.body.searchType;
  const searchValue = req.body.searchValue;
  const vendorSelected = req.body.vendorSelected;
  const searchManufacturer = req.body.searchManufacturer;
  // console.log ("BODY-NEXT searchType: " + searchType + " searchValue: " + searchValue);
  scroll(limit, offset, searchType, searchValue, vendorSelected, searchManufacturer, req, res);
}



function scroll( limit, offset, searchType, searchValue, vendorSelected, searchManufacturer, req, res) {
  populateVendors();

  console.log('RETURN RECORDS: ' + offset + " to " + (offset + limit) + 
              ' SEARCH PARAMS: ' + searchType + ' . ' + searchValue +
              ' VENDOR: ' + vendorSelected + ' MANUFACTURER: ' + searchManufacturer);
  if (searchValue || vendorSelected || searchManufacturer) {
    if (!searchValue || searchValue === '') {
      req.flash('error', 'Search term is required to use "Advanced Search" feature.');
      return res.status(307).redirect('/list-parts');
    }
    fetchMatching(limit, offset, searchValue, searchType, vendorSelected, searchManufacturer, req, res);
  } else {
    fetchAll(offset, limit, req, res);
  }
}

function fetchAll(offset, limit, req, res)  {
   let errorMessage = req.flash('error');
   PartService.fetchAll(limit, offset)
    .then(([rows, fieldData]) => {
      res.render('part/part-list', {
        parts: rows,
        offset: offset,
        limit: limit,
        searchValue: "",
        searchType: "1",
        searchManufacturer: "",
        vendorSelected:"",
        allVendors: allVendorMap,
        pageTitle: 'All Parts',
        path: '/parts',
        errorMessage: getSingleErrorMessage(errorMessage)
      });
    })
    .catch(err => console.log(err));
}

function fetchMatching(limit, offset, searchValue, searchType, vendorSelected, searchManufacturer, req, res) {
  PartService.findMatching(limit, offset, searchValue, searchType, vendorSelected, searchManufacturer)
    .then(([rows, fieldData]) => {
      let errorMessage = req.flash('error');
      res.render('part/part-list', {
        parts: rows,
        offset: offset,
        limit: limit,
        searchType: searchType,
        searchValue: searchValue,
        searchManufacturer: searchManufacturer,
        vendorSelected: vendorSelected,
        allVendors: allVendorMap,
        pageTitle: 'Parts Matching: "' + searchValue +'"',
        path: '/parts',
        errorMessage: getSingleErrorMessage(errorMessage)
      });
    })
  .catch(err => console.log(err));
}


exports.getPart = (req, res, next) => {
  const partId = req.params.partId;
  PartService.findById(partId)
    .then(([part]) => {
      res.render('part/part-detail', {
        part: part[0],
        pageTitle: part.vendor_sku,
        path: '/parts',
      });
    })
    .catch(err => console.log(err));
};





exports.goBack = async (req, res, next) => {
  const breadcrumb = JSON.parse(req.body.breadcrumb);
  if (breadcrumb.method === "GET") {
      return res.redirect('/list-parts');
  }

  const postParams = breadcrumb.body;
   console.log("GO BACK TO: " + JSON.stringify(breadcrumb) );
  // Object.keys(postParams).forEach((keyname) => {
  //    console.log(keyname + ':' + breadcrumb.body[keyname]);
  // });
  // console.log("BREADCRUMB BODY: " + JSON.stringify(postParams) );
  //{"_csrf":"TiHsEUY1-_TBFuiuT6rZdQs-EIwVn9lz3_JU","searchParameter":"NTK589PLE6","searchType":"1","vendorSelected":"","searchManufacturer":"Blue"}
  const fullUrl = req.protocol + '://' + req.get('host') + breadcrumb.url;
  console.log("FORWARD TO: " + fullUrl);

  let requestHeaders = req.headers;
  requestHeaders['content-type'] = 'application/json';
  requestHeaders['content-length'] = Buffer.byteLength(JSON.stringify(postParams));
  requestHeaders['csrf-token'] = postParams._csrf;

  //console.log("HEADERS: " + JSON.stringify(requestHeaders) );
  await request.post({ headers: req.headers, url: fullUrl, 
               json: true, body: postParams },
               function(error, response, body) {
                  if (error) {
                    console.error('ERROR redirecting back to parts list:', error);
                  }
                  console.log('statusCode:', response && response.statusCode);
                  return res.send(body);
  }); 
}