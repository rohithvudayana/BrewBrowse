import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import * as CustomError from "../errors/";

type Callback = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const asyncWrapper = (callback: Callback): Callback => {
  return async ( req: Request, res: Response, next: NextFunction ) : Promise<void> => {
    try {
      await callback(req, res, next);
    } catch (error: any) {
      console.error(error.message);
      if (error instanceof mongoose.Error.CastError) {
        next(CustomError.BadRequestError("Invalid user id"));
      } else {
        next(CustomError.InternalServerError(`Something went wrong ${error.message}`));
      }
    }
  };
};

export default asyncWrapper;
