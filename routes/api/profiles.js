const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const auth = require("../../modules/auth");

// ////////////////////////// only for logged user ///////////////////////////////////

router.use(auth.verifyToken);

router.get("/:username", (req, res) => {
  let username = req.params.username;
  User.findOne({ username }, "-password")
    .populate({ path: "article", populate: { path: "author" } })
    .exec((err, profile) => {
      if (err) return res.json({ err });
      if (!profile)
        return res.json({
          success: false,
          message: "Having trouble finding profile!!"
        });
        res.json(profile)
    });
});

module.exports = router;
