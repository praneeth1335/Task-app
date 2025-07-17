const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

// Middleware to handle messages
const setMessage = (req, type, message) => {
  req.session.messages = req.session.messages || {};
  req.session.messages[type] = message;
};

const getMessage = (req, type) => {
  const messages = req.session.messages || {};
  const message = messages[type];
  delete req.session.messages?.[type]; // Clear after reading
  return message;
};

// Login routes
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("login", {
    message: getMessage(req, "error"),
    success_msg: getMessage(req, "success"),
    title: "Login",
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      setMessage(req, "error", "An error occurred during login");
      return res.redirect("/login");
    }
    if (!user) {
      setMessage(req, "error", info?.message || "Invalid credentials");
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        setMessage(req, "error", "Login failed");
        return res.redirect("/login");
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

// Registration routes
router.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("register", {
    error: getMessage(req, "error"),
    success_msg: getMessage(req, "success"),
    title: "Register",
  });
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      setMessage(req, "error", "Username and password are required");
      return res.redirect("/register");
    }

    if (password.length < 6) {
      setMessage(req, "error", "Password must be at least 6 characters");
      return res.redirect("/register");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      setMessage(req, "error", "Username already taken");
      return res.redirect("/register");
    }

    const user = new User({ username, password });
    await user.save();

    setMessage(req, "success", "Registration successful! Please log in.");
    res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    setMessage(req, "error", "Registration failed. Please try again.");
    res.redirect("/register");
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/");
    }
    setMessage(req, "success", "You have been logged out");
    res.redirect("/login");
  });
});

module.exports = router;
// // ==================== authRoutes.js ====================
// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const User = require("../models/User");

// // Login routes
// router.get("/login", (req, res) => {
//   if (req.isAuthenticated()) return res.redirect("/");
//   res.render("login", {
//     error: req.flash("error"),
//     success_msg: req.flash("success_msg"),
//     title: "Login",
//   });
// });

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })(req, res, next);
// });

// // Registration routes
// router.get("/register", (req, res) => {
//   if (req.isAuthenticated()) return res.redirect("/");
//   res.render("register", {
//     error: req.flash("error"),
//     success_msg: req.flash("success_msg"),
//     title: "Register",
//   });
// });

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       req.flash("error", "Username and password are required");
//       return res.redirect("/register");
//     }
//     if (password.length < 6) {
//       req.flash("error", "Password must be at least 6 characters");
//       return res.redirect("/register");
//     }

//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       req.flash("error", "Username already taken");
//       return res.redirect("/register");
//     }

//     const user = new User({ username, password });
//     await user.save();

//     req.flash("success_msg", "Registration successful! Please log in.");
//     res.redirect("/login");
//   } catch (error) {
//     console.error("Registration error:", error);
//     req.flash("error", "Registration failed. Please try again.");
//     res.redirect("/register");
//   }
// });

// // Logout route
// router.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error("Logout error:", err);
//       return res.redirect("/");
//     }
//     req.flash("success_msg", "You have been logged out");
//     res.redirect("/login");
//   });
// });

// module.exports = router;
