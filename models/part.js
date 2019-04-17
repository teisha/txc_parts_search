'use strict';
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



};
