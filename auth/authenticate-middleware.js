/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");
const secrets = require("./secrets");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  token
    ? jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
        err
          ? res.status(401).json({ you: "shall not pass!" })
          : (req.user = { username: decodedToken.username });
        next();
      })
    : res.status(400).json({ error: "no token provided" });
};
