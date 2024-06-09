import { Request, Response, NextFunction } from "express";
import axios from "axios";
import asyncWrapper from "../helpers/asyncWrapper";
import { StatusCodes } from "http-status-codes";
import * as CustomErrors from "../errors";

export const getBrewey = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
      const response = await axios.get(
        `https://api.openbrewerydb.org/v1/breweries/${id}`
      );
      res.status(StatusCodes.OK).json(response.data);
    } catch (error) {
      next(error);
    }
  }
);

export const getAllBreweries = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await axios.get(
        `https://api.openbrewerydb.org/v1/breweries/`
      );
      res.status(StatusCodes.OK).json(response.data);
    } catch (error) {
      next(error);
    }
  }
);

export const getBreweryBySearch = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const typesArray : string[] = [
        "micro",
        "regional",
        "brewpub",
        "large",
        "planning",
        "bar",
        "contract",
        "proprietor",
        "closed",
        "nano"
    ];
    const { city= "", type="", name="" } = _req.query;
    const apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_city=${city}&by_name=${name}` + (type && typesArray.includes((type.toString())) ? `&by_type=${type}` : '');

    try {
      const res = await axios.get( apiUrl );
      _res.status(StatusCodes.OK).json(res.data);
    } catch (error: any) {
      return _next(
        CustomErrors.InternalServerError(
          `Failed to fetch breweries for state: ${city}, name: ${name} and type: ${type} due to ${error.message}`
        )
      );
    }
  }
);