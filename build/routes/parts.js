"use strict";const path=require("path"),express=require("express"),router=express.Router(),partsController=require("../controllers/parts"),validateLogin=require("../middleware/validateAuthentication");router.get("/index",validateLogin,partsController.getIndex),router.get("/list-parts",validateLogin,partsController.getParts),router.get("/list-parts-previous",validateLogin,partsController.getPreviousParts),router.get("/list-parts-next",validateLogin,partsController.getNextParts),router.get("/part-detail/:partId",validateLogin,partsController.getPart),router.post("/part-search",validateLogin,partsController.searchParts),module.exports=router;