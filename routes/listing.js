const express=require("express")
const router=express.Router()
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const {isLoggedIn}=require("../middleware.js")

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if(error){
      throw new ExpressError(400,res.error)
    }
    else{
      next()
    }
  }


router.get("/", wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({})
    res.render("listings/index.ejs",{allListing})
})
)
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs")
})
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing you requested for does not exist")
      res.redirect("/listing")
    }
    res.render("listings/show.ejs", { listing });
  })
)
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing created")
    res.redirect("/listing");
    })
  );
  router.get("/:id/edit",isLoggedIn, wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist")
      res.redirect("/listing")
    }
    res.render("listings/edit.ejs", { listing });
  })
)
  //Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","listing updated")
    res.redirect(`/listing/${id}`);
  })
)

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted")
    res.redirect("/listing");
  })
)
module.exports=router