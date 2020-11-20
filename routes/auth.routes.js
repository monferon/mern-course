const { Router, response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

// api/auth/register
router.post(
  "/register",
  [
    check("email", "Wrong email").isEmail(),
    check("password", "Minimal length password is 6 symbols").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      console.log("Body", req.body);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorected data in register",
        });
      }
      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        response.status(400).json({ message: "User alredy register" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email: email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "Usser Created!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something wrong..." });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorected data in login",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Password incrorrected!" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something wrong..." });
    }
  }
);

module.exports = router;
