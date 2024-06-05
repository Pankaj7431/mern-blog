import express from "express";
import {
  SignOut,
  deleteUser,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:Id", verifyToken, updateUser);
router.delete("/delete/:Id", verifyToken, deleteUser);
router.post("/signout", SignOut);
export default router;
