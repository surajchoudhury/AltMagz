const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const passport = require('passport');
const auth = require("../../modules/auth");

//Oauth

router.get('/auth/google',passport.authenticate('google',{scope:['profile']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/login'}),(req,res)=> {
  res.redirect('/')
})


// register user

router.post("/", (req, res) => {
  console.log(req.body);
  User.create(req.body, (err, user) => {
    if (err) return res.json({ err });
    if (!user) return res.json({ success: false, message: "User not found!" });
    res.json({ success: true, message: "Registration Successful !" });
  });
});

// login user

router.post("/login", (req, res) => {
  let { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return res.json({ err });
    if (!user)
      return res.json({ success: false, message: "Invalid Email ID!!" });
    user.verifyPassword(password, (err, match) => {
      if (err) return res.json({ err });
      if (!match)
        return res.json({ success: false, message: "Invalid Password!!" });

      //json web token authentication

      jwt.sign(
        {
          username: user.username,
          email: user.email,
          userid: user._id,
          image: user.profile,
          bio:user.bio
        },
        process.env.secret,
        (err, token) => {
          if (err) return res.json({ err });
          req.headers.authorization = token;
          res.json({ success: true, message: "Login successful!", token });
        }
      );
    });
  });
});


///////////////////////// only logged user can access ////////////////////////////////////
router.use(auth.verifyToken);



//test route

router.get("/protected", (req, res) => {
  res.json({ success: true, message: "you are welcome!" });
});


// get loggedin user

router.get("/", (req, res) => {
  let { username } = req.user;
  User.findOne({ username }, "-password", (err, user) => {
    if (err)
      return res.status(422).json({
        errors: {
          body: "unexpected error!"
        }
      });
    res
      .contentType("application/json")
      .status(200)
      .json(user);
  });
});

// update current user

router.put("/", (req, res, next) => {
  let { username } = req.user;
  User.findOneAndUpdate({ username }, req.body, { new: true }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(422).json("User not found!");
    res
      .contentType("application/json")
      .status(200)
      .json(user);
  });
});


module.exports = router;
