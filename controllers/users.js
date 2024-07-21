const user=require("../models/user")
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.signup=async (req,res)=>{
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
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}
module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to wanderLust")
    let redirecturl=res.locals.redirectUrl || "/listing"
    res.redirect(redirecturl)
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","you are logged out now!")
        res.redirect("/listing")
    })
}