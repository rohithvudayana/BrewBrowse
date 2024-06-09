import express from "express"
import { getAllBreweries,getBreweryBySearch,getBrewey } from "../controllers/breweryController";
import { authenticateToken } from "../middleware/authToken";

export const breweRouter = express.Router();

breweRouter.get("/getBrewes/:id",  authenticateToken, getBrewey)
            .get("/getAllBrewes",authenticateToken, getAllBreweries)
            .get("/search",authenticateToken, getBreweryBySearch)