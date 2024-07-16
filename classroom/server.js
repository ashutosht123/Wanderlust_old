const express=require("express")
const app=express()
const session=require("express-session")
const flash=require("connect-flash")
const path=require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized: true
}
app.use(session(sessionOptions))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.message=req.flash("success")
    next()
})
app.get("/regester",(req,res)=>{
    let {name}=req.query
    req.session.name=name
    req.flash("success","user regestered successfully")
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name,msg:req})
})
app.listen(30000,()=>{
    console.log("listning on port 30000")
})