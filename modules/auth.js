const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err) return res.json({ err });
      if (!decoded)
        return res.json({
          success: false,
          message: "Can't decode try entering valid token!"
        });
      req.user = {
        username: decoded.username,
        email: decoded.email,
        token,
        userid: decoded.userid,
        image: decoded.profile,
        bio: decoded.bio
      };
      next();
    });
  } else {
    res.status(401).json({ success: false, message: "Token not found!!" });
  }
};
