import {Router} from "express";
import { getMessage, uploadFile } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthController.js";
import multer from "multer"
const MessageRoute = Router();
const upload = multer({ dest: "uploads/temp" }); 

MessageRoute.post("/get-message",verifyToken,getMessage)
MessageRoute.post("/upload-file",verifyToken,upload.single("file"),uploadFile)

export default MessageRoute;