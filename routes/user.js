const express=require("express")
const router=express.Router()
const user=require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware")
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})
router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}=req.body
    const newUser=new user({email,username})
    const regesteredUser=await user.register(newUser,password)
    console.log(regesteredUser)
    req.login(regesteredUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome to WanderLust")
    res.redirect("/listing")
    })
    
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post("/login", saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
async(req,res)=>{
    req.flash("success","welcome back to wanderLust")
    let redirecturl=res.locals.redirectUrl || "/listing"
    res.redirect(redirecturl)
})

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","you are logged out now!")
        res.redirect("/listing")
    })
})
module.exports=router
