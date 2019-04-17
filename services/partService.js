'use strict';
const db = require('../util/database');

module.exports = class PartService {
  static fetchAll(limit, offset) {
    console.log("Find All: " );
    return db.execute('SELECT  pi.manufacturer_id, pi.vendor_id, parts_inventory_id, products_model, part_number, '+ 
        ' vendor_sku, quantity, cost, weight, part_name, part_description, condition_indicator, ' + 
        ' msrp, listed_price, etilize_id, date_loaded, vendor_short_name, vendor_name, ' + 
        ' is_channelonline_compatible, manufacturer_name, manufacturer_code, etilize_mfg_id '+ 
        ' FROM parts_inventory pi  ' +
                      ' INNER JOIN vendors v  ON pi.vendor_id = v.vendor_id  ' +
                      ' INNER JOIN manufacturers m  ON pi.manufacturer_id = m.manufacturer_id ' +                      
                      ' ORDER BY pi.vendor_id, vendor_sku LIMIT ? OFFSET ?',
            [limit, offset]);
  }

  static findById(id) {
    return db.execute('SELECT  pi.manufacturer_id, pi.vendor_id, parts_inventory_id, products_model, part_number, '+ 
        ' vendor_sku, quantity, cost, weight, part_name, part_description, condition_indicator, ' + 
        ' msrp, listed_price, etilize_id, date_loaded, vendor_short_name, vendor_name, ' + 
        ' is_channelonline_compatible, manufacturer_name, manufacturer_code, etilize_mfg_id '+ 
        ' FROM parts_inventory pi  ' +
                      ' INNER JOIN vendors v  ON pi.vendor_id = v.vendor_id  ' +
                      ' INNER JOIN manufacturers m  ON pi.manufacturer_id = m.manufacturer_id ' +                      
                      ' WHERE parts_inventory_id = ?', [id]);
  }


  static findMatching(limit, offset, searchValue, searchType, vendorSelected, searchManufacturer) {
    let searchString = searchValue;
    let productsModelSearch = searchValue.replace(/[^a-zA-Z0-9]/g, '');
    let operation = '=';
    switch(searchType) {
      case '1':
        searchString = searchValue + '%';
        productsModelSearch = productsModelSearch + '%';
        operation = 'LIKE';
        break;
      case '3':
        searchString = '%' + searchValue + '%';
        productsModelSearch = '%' + productsModelSearch + '%';
        operation = 'LIKE';
        break;
    }
    console.log('SEARCHING: ' + searchString + ' / ' + productsModelSearch);

    let sqlString = ['SELECT  pi.manufacturer_id, pi.vendor_id, parts_inventory_id, products_model, part_number, '+ 
        ' vendor_sku, quantity, cost, weight, part_name, part_description, condition_indicator, ' + 
        ' msrp, listed_price, etilize_id, date_loaded, vendor_short_name, vendor_name, ' + 
        ' is_channelonline_compatible, manufacturer_name, manufacturer_code, etilize_mfg_id '+ 
        ' FROM parts_inventory pi  ' +
                      ' INNER JOIN vendors v  ON pi.vendor_id = v.vendor_id  ' +
                      ' INNER JOIN manufacturers m  ON pi.manufacturer_id = m.manufacturer_id ' +                      
                      ' WHERE vendor_sku ' + operation + '  \'' + searchString + '\' OR '+
                      '       products_model ' + operation + '  \'' + productsModelSearch + '\' OR '+
                      '       part_number ' + operation + '  \'' + searchString + '\' OR '+
                      '       part_name ' + operation + '  \'' + searchString + '\' '];
      if (vendorSelected) {
        sqlString.push(' AND v.vendor_id = ' + vendorSelected);
      }
      if (searchManufacturer) {
        sqlString.push(' AND manufacturer_name LIKE \'' + searchManufacturer + '%\' ');
      }
                                    
      sqlString.push(' ORDER BY pi.vendor_id, vendor_sku LIMIT ? OFFSET ?');
//      console.log( sqlString);
    return db.execute (sqlString.join(' '),  [limit, offset]);
  }	
}