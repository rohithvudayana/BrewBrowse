import Review from '../models/review';
import { Request, Response, NextFunction } from "express";
import * as CustomErrors from "../errors"
import asyncWrapper from "../helpers/asyncWrapper";
import { StatusCodes } from "http-status-codes";
import mongoose from 'mongoose';

export const addReviewController = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction): Promise<void> => {
      const { newReview, rating, id } = _req.body;
      const user = _req.user?.username;

      if (!newReview || !rating || !id) {
        _res.status(StatusCodes.BAD_REQUEST).json({ error: 'Data is missing' });
        return;
      }

      try {
        const existingReview = await Review.findOne({ reviewID: id });

        if (existingReview) {
          existingReview.reviewArray.push({
            owner: user,
            review: newReview,
            rated: rating,
          });
          const totalRated = existingReview.reviewArray.reduce( (acc, review) => acc + review.rated, 0 );
          existingReview.overallRating = totalRated / existingReview.reviewArray.length;
          await existingReview.save();

          _res.status(StatusCodes.OK).json({ message: 'Review added to existing card', review: existingReview,});
        }
        else {
          const newReviews = await Review.create({
            reviewID: id,
            reviewArray: [{ owner: user, review: newReview, rated: rating }],
            overallRating: rating,
          });

          _res.status(StatusCodes.CREATED).json({
            message: 'New card created with review',
            review: newReviews,
          });
        }
      }
      catch (error: any) {
        console.error('Error handling new reviews:', error);
        if (error instanceof mongoose.Error.CastError) {
          _next(CustomErrors.BadRequestError('Invalid user id'));
        } else {
          _next(CustomErrors.InternalServerError(`Something went wrong ${error.message}`));
        }
      }
    }
  );


  export const getReviewController = asyncWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
      const existingReview = await Review.findOne({ reviewID: id });

      if (existingReview) {
        const { reviewArray, overallRating } = existingReview;
        res.status(StatusCodes.OK).json({ reviews: reviewArray, overallRating });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Review not found with the provided ID' });
      }
    } catch (error: any) {
      console.error('Error handling reviews:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  });



