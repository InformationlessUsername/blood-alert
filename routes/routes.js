const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const controller = require("../controllers/controller");
const csrf = require("csurf");

const router = express.Router();

// All requests to this router will use the csrf middleware
router.use(csrf({ cookie: true }));
// Set outgoing csrf cookie to be same as incoming csrf cookie
router.all("*", function (req, res, next) {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

// Verify JWT token
// If invalid, redirect to /login
// Can be placed in router requests to verify token before accessing route
function authenticateToken(req, res, next) {
  const token = req.cookies["JWT"];
  if (token == null) return res.redirect("/login");

  // Verifies token. redirect to /login if error.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("User not logged in, redirecting");
      res.redirect("/login");
    }

    // If no error, assign id to req.id
    req.id = decoded.id;
    next();
  });
}

// GET requests
router.get("/", controller.index_get);
router.get("/login", controller.login_get);
router.get("/logout", controller.logout_get);

router.get("/profile", authenticateToken, controller.profile_get);

// POST requests
router.post("/login", controller.login_post);

router.post("/profile", authenticateToken, controller.profile_post);

//404 (Final route)
router.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

module.exports = router;
