const db = require('../util/database');

// const Cart = require('./cart');

module.exports = class Part {
  constructor(id, vendorId, manufacturerId, productModel, partNumber, vendorSku, quantity, 
           cost, weight, partName, partDescription, condition, msrp, listedPrice, etilizeId,
           dateLoaded) {
    this.id = id;
    this.vendorId = vendorId;
    this.manufacturerId = manufacturerId;
    this.productModel = productModel;
    this.partNumber = partNumber;
    this.vendorSku = vendorSku;
    this.quantity = quantity;
    this.cost = cost;
    this.weight = weight;
    this.partName = partName;
    this.partDescription = partDescription;
    this.condition = condition;
    this.msrp = msrp;
    this.listedPrice = listedPrice;
    this.etilizeId = etilizeId;
    this.dateLoaded = dateLoaded;
  }


  static fetchAll(limit, offset) {
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


  static findMatching(limit, offset, searchValue) {
    const sqlString = 'SELECT  pi.manufacturer_id, pi.vendor_id, parts_inventory_id, products_model, part_number, '+ 
        ' vendor_sku, quantity, cost, weight, part_name, part_description, condition_indicator, ' + 
        ' msrp, listed_price, etilize_id, date_loaded, vendor_short_name, vendor_name, ' + 
        ' is_channelonline_compatible, manufacturer_name, manufacturer_code, etilize_mfg_id '+ 
        ' FROM parts_inventory pi  ' +
                      ' INNER JOIN vendors v  ON pi.vendor_id = v.vendor_id  ' +
                      ' INNER JOIN manufacturers m  ON pi.manufacturer_id = m.manufacturer_id ' +                      
                      ' WHERE vendor_sku LIKE \'%' + searchValue + '%\' OR '+
                      '       products_model LIKE  \'%' + searchValue + '%\' OR '+
                      '       part_number LIKE \'%' + searchValue + '%\' OR '+
                      '       part_name LIKE \'%' + searchValue + '%\' ' +
                      ' ORDER BY pi.vendor_id, vendor_sku LIMIT ? OFFSET ?';
    console.log(sqlString)                      
    return db.execute (sqlString,  [limit, offset]);
  }

};
