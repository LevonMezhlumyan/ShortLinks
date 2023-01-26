import { validationResult } from "express-validator";
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcrypt";

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid credentials" });
      }
      const { email, password } = req.body;
      const candidate = await UserModel.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hash = await bcrypt.hash(password, 10);
      const user = new UserModel({ email, password: hash });
      await user.save();
      res.status(201).json({ message: "User has been created" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid credentials" });
      }
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User is not registered" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.JWTSECRETKEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

export default new AuthController();
