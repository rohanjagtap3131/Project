
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
    
}
const listing = require('./models/listing.js');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const ListingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '/public')));

app.engine("ejs", ejsMate);


const port = 8080;
  
main()
    .then(() => {
        console.log("Connecting successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl :dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",() =>{
    console.log("")
})
const sessionOptions = {
    store,
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,
}



app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    
    next();
});



app.use("/listing",ListingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err
    res.status(statusCode).render("./listings/error.ejs", { err })
})


app.listen(port, () => {
    console.log("App is lisning on port " + port);
});