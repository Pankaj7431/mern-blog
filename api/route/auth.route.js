import express from "express";
import { SignIn, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", SignIn);

export default router;
