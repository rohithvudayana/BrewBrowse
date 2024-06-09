import express from "express";
import { addReviewController, getOverallRating, getReviewController } from "../controllers/reviewController";
import { authenticateToken } from "../middleware/authToken";
export const reviewRouter = express.Router();

reviewRouter.post("/addReview", authenticateToken, addReviewController)
            .get("/:id",authenticateToken, getReviewController)
            .get("/rating/:id", getOverallRating);