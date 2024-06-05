import express from "express";
import { Google, SignIn, SignUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", SignUp);
router.post("/sign-in", SignIn);
router.post("/google", Google);


export default router;
