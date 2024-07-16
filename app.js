const express=require("express")
const app=express()
const mongoose=require("mongoose")
const path=require("path")
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError.js")
const routListing=require("./routes/listing.js")
const routesReviews=require("./routes/reviews.js")
const session=require("express-session")
const flash=require("connect-flash")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate)
app.use(express.static(path.join(__dirname,"/public")))

async function main() {
  await mongoose.connect(MONGO_URL);
}

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlustdata'
main().then((result)=>{
    console.log("connected to db")
}).catch(err => console.log(err));

const sessionOptions={
  secret:"mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}

app.get("/",(req,res)=>{
  res.send("hi iam root")
})

app.use(session(sessionOptions))
app.use(flash())

app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")

  next()
})

app.use("/listing",routListing)
app.use("/listing/:id/reviews",routesReviews)
  
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!"))
})
app.use((err,req,res,next)=>{
  let {statusCode=500,message="somthing went wrong"}=err
  res.render("error.ejs", {err})
  // res.status(statusCode).send(message)
})
app.listen(8000,()=>{
    console.log("listening on port 8000")
})
