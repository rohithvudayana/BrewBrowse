import express from "express";
import dotenv from "dotenv";
import { httpResponse } from "./helpers/createResponse";
import { routeNotFound } from "./middleware/routeNotFound";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/authRoutes";
import {reviewRouter} from "./routes/reviewRoutes";
import { breweRouter } from "./routes/breweRoutes";
import cors from "cors";

dotenv.config();

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ok", (_req, _res) => {   _res.status(200).send(httpResponse(true, "OK", {}))   })

app.use(`/auth`, authRouter);
app.use(`/review`, reviewRouter);
app.use(`/brewery`, breweRouter);

app.use(cors())
app.use(routeNotFound);
app.use(errorHandler);