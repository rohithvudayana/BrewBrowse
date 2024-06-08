import { Request, Response, NextFunction } from "express";
import axios from "axios";
import asyncWrapper from "../helpers/asyncWrapper";
import { StatusCodes } from "http-status-codes";

export const getBreweryController = asyncWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries/${id}`);
        res.status(StatusCodes.OK).json(response.data);
    } catch (error) {
        next(error);
    }
});

export const getAllBrewesController = asyncWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries/`);
        res.status(StatusCodes.OK).json(response.data);
    } catch (error) {
        next(error);
    }
});
