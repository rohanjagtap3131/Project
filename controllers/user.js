const User = require('../models/user.js');

module.exports.renderSignUpForm =(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.userSignup =  async(req,res)=>{
    try{
    let {username,email,password} = req.body;

   let newUser = new User({username,email});
   const registeredUser = await User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
       if(err){
           return next(err);
        }
        req.flash('success',"Welcome to Wanderlust");
        res.redirect("/listing");
    });
    
  
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
}


module.exports.userLogin =async(req,res)=>{
    req.flash("success","Welcome Back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
}

module.exports.logOutUser =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing");
    })
}

