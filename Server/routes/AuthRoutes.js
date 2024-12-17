import { Router } from "express";
import { addProfileImage, getuserinfo, loign, signup, updateProfile,removeProfileImage, logout} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthController.js";
import multer from "multer";


const upload=multer({dest:"uploads/profiles/"});

const AuthRoutes = Router();

AuthRoutes.post("/signup",signup);
AuthRoutes.post("/login",loign);
AuthRoutes.get("/user-info",verifyToken,getuserinfo);
AuthRoutes.put("/update-profile",verifyToken,updateProfile);
AuthRoutes.post("/add-profile-image",verifyToken,upload.single("profile-image"),addProfileImage);
AuthRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage);
AuthRoutes.post("/logout",logout);

export default AuthRoutes;