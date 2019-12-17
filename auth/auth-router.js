const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./auth-model");
const secrets = require("./secrets");
const restricted = require("./authenticate-middleware");

router.post("/register", async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  try {
    const newUser = await Users.add(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", (req, res) => {
  // implement login
  let { username, password } = req.body;
  Users.getByFilter({ username })
    .first()
    .then(user => {
      if (!user && !bcrypt.compareSync(password, user.password)) {
        res.status(401).json({ error: "incorrect username and/or password" });
      } else {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome, ${user.username}`,
          token
        });
      }
    })
    .catch(err => {
      res.status(500).json(error);
    });
});

router.get("/users", restricted, (req, res) => {
  Users.getUsers()
    .then(list => {
      res.status(200).json(list);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

function generateToken(user) {
  const payload = {
    username: user.username,
    id: user.id
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
