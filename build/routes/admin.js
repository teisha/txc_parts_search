"use strict";const path=require("path"),express=require("express"),adminController=require("../controllers/admin"),validateLogin=require("../middleware/validateAuthentication"),router=express.Router();router.get("/show-loader-params",validateLogin,adminController.showLoaderParams),router.get("/generic-loader-parameters",validateLogin,adminController.viewGenericLoaderParams),router.get("/markup-loader-parameters",validateLogin,adminController.viewMarkupLoaderParams),router.get("/loader-history",validateLogin,adminController.viewLoaderHistory),router.get("/web-users",validateLogin,adminController.viewWebUsers),router.get("/requests",validateLogin,adminController.getRequest),router.post("/post-request",validateLogin,adminController.postRequest),module.exports=router;