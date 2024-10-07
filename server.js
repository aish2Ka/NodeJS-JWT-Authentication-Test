const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const { expressjwt: jwtd } = require("express-jwt");
const bodyParser = require("body-parser");
const path = require("path");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3000;
const secretKey = "I am an Indian";
const jwtMW = jwtd({
    secret: secretKey,
    algorithms: ["HS256"]
});

const users = [
  {
    id: 1,
    username: "aish",
    password: "1234",
  },
  {
    id: 2,
    username: "harshith",
    password: "4567",
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  for (let user of users) {
    if (username === user.username && password === user.password) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "3m" } 
      );
      res.json({
        success: true,
        error: null,
        token,
      });
      break;
    } else {
      res.status(401).json({
        success: false,
        error: "Invalid username or password",
        token: null,
      });
    }
  }
  console.log("Hi This is me", username, password);
  res.json({ message: "Login Successful" });
});


app.get(
  "/api/dashboard",
  jwtMW,
  (req, res) => {
    res.json({
      success: true,
      myContent: "Secret content only logged people can see",
    });
  }
);

app.get(
    "/api/prices",
    jwtMW,
    (req, res) => {
      res.json({
        success: true,
        myContent: "This is the cost of the product in dollars- $4.5505",
      });
    }
  );

  app.get(
    "/api/settings",
    jwtMW,
    (req, res) => {
      res.json({
        success: true,
        myContent: "This is the settings page",
      });
    }
  );


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  console.log(err.name === "unauthorizedError");
  console.log(err);
  if (err.name === "unauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Username or password is incorrect 2",
    });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
