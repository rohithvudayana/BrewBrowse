import express from "express"
import { getAllBrewesController, getBreweryController } from "../controllers/breweryController";
import { authenticateToken } from "../middleware/authToken";

export const breweRouter = express.Router();

breweRouter.get("/getBrewes/:id", authenticateToken , getBreweryController)
            .get("/getAllBrewes", authenticateToken, getAllBrewesController)