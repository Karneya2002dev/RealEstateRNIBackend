import express from "express";
import { getAllProperties } from "../controllers/propertiesController.js";

const router = express.Router();

// GET all properties
router.get("/", getAllProperties);

export default router;
