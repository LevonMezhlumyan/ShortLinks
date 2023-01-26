import { Router } from "express";
import { check } from "express-validator";
import AuthController from "../controller/AuthController.js";

const router = Router();

router.post(
  "/login",
  [
    check("email", "Invalid email").normalizeEmail().isEmail(),
    check("password", "Password length must be from 4 to 12").exists(),
  ],
  AuthController.login
);
router.post(
  "/register",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Password length mus be from 4 to 12").isLength({
      min: 4,
      max: 12,
    }),
  ],
  AuthController.register
);

export default router;
