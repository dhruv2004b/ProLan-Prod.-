import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.post("/signup", signup);

router.post("/onboarding",protectRoute, onboard);

router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ message: "This is a protected route", user: req.user });
});

export default router;
