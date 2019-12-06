const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /@/
    },
    password: {
      type: String,
      required: true
    },
    article:{
      type:Schema.Types.ObjectId,
      ref:'Article'
    },
    bio:{
      type:String
    },
    profile:{
      type:String
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function(next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, password) => {
      if (err) return res.json({ err });
      if (!password)
        return res.json({ success: false, message: "Password not found!" });
      this.password = password;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, match) => {
    if (err) return done(null, false);
    done(null, match);
  });
};

module.exports = mongoose.model("User", userSchema);
