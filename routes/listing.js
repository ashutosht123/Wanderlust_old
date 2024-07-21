const express=require("express")
const router=express.Router()
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn, isowner,validateListing}=require("../middleware.js")
const listingCongtroller=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage})

router.route("/")
.get(wrapAsync(listingCongtroller.index))
.post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingCongtroller.createListing));


router.get("/new", isLoggedIn, listingCongtroller.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingCongtroller.showListing))
.put(isLoggedIn,isowner,upload.single('listing[image]'), validateListing, wrapAsync(listingCongtroller.updateListing))
.delete(isLoggedIn,isowner, wrapAsync(listingCongtroller.distroyListing))

router.get("/:id/edit",isLoggedIn,isowner, wrapAsync(listingCongtroller.rederEditForm))
module.exports=router