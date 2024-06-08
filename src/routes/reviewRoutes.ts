import express from "express";
import { addReviewController, getReviewController } from "../controllers/reviewController";

export const reviewRouter = express.Router();

reviewRouter.post("/addReview", addReviewController)
            .get("/:id", getReviewController);