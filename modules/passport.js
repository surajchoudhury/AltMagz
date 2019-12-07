const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "938938972679-av1fkni440c7bftigffbrs5jcmgt9daj.apps.googleusercontent.com",
      clientSecret: "XBx8AMWrXiJh-B0dWRwd7ZK6",
      callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findById({ _id: profile.id }, (err, user) => {
        if (err) return done(null, false);
        if (!user) {
          const user = {
            username: profile._json.name,
            profile: profile._json.picture
          };
          User.create(user, (err, createdUser) => {
            if (err) return done(null, false);
            done(null, user);
          });
        }
        done(null, user);
        console.log(user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) return done(err, false);
    done(null, user);
  });
});
