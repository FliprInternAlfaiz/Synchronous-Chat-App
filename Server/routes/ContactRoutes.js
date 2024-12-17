import { Router } from "express";
import { getContactforDMList, SearchContact } from "../controllers/ContactController.js";
import { verifyToken } from "../middlewares/AuthController.js";
const contactRoutes = Router();

contactRoutes.post("/serach",verifyToken,SearchContact)
contactRoutes.get("/get-contact-for-dm",verifyToken,getContactforDMList)

export default contactRoutes;
