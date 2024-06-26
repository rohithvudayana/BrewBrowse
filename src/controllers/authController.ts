import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import * as CustomErrors from "../errors"
import asyncWrapper from "../helpers/asyncWrapper";
import { hashPassword, hashCompare } from "../helpers/hashPassword";
import { httpResponse } from "../helpers/createResponse";
import {  genToken } from "../helpers/jwt";
import { StatusCodes } from "http-status-codes";

export const loginController = asyncWrapper(
    async ( _req: Request, _res: Response, _next: NextFunction ) => {
        const {email, password } = _req.body;
        if(!email || !password)
            return _next(
                CustomErrors.BadRequestError("Please provide email and password")
            );
        const user = await User.findOne ({email : email});
        if(!user)
            return _next(
                CustomErrors.NotFoundError("Invalid email or user does not exist")
            )
        if(!user.password)
            return _next(
                CustomErrors.InternalServerError("User password not found in the database")
            );

        if(hashCompare(password, user.password)){
            const accessToken = genToken(user);
            _res.status(StatusCodes.OK).json(httpResponse(true, "User logged in successfully", accessToken));
        }else{
            return _next(CustomErrors.UnauthorizedError("Invalid password"));
        }
    }
)

export const registerController = asyncWrapper(
    async (_req: Request, _res:Response, _next:NextFunction ) => {
        if( !_req.body.email || !_req.body.password )
            return _next(  CustomErrors.BadRequestError("please provide all required fields") )

        let user = await User.findOne({email : _req.body.email});
        if(user)
            return _next(  CustomErrors.BadRequestError("User already exists")  );
        else{
            try{
                const hashedPassword = hashPassword(_req.body.password);
                user = await User.create({..._req.body, password: hashedPassword});
            }catch (err: any) {
                return _next(CustomErrors.BadRequestError("Invalid user data" + err.message));
            }

            const accessToken = genToken(user);
            _res.status(StatusCodes.CREATED).json(httpResponse(true, "User created Successfully", accessToken));
        }
    }
)














