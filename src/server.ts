import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/database";
import { BASEURL } from "./constants";
import { httpResponse } from "./helpers/createResponse";
import { routeNotFound } from "./middleware/routeNotFound";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/authRoutes";
import {reviewRouter} from "./routes/reviewRoutes";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;
try{
    if(!process.env.CONNECTION)
        throw new Error("no connection string found in .env file");

    connectDB(process.env.CONNECTION);
    app.listen(port, () => {
        console.log(`server listening on : http://localhost:${port}/`);
    });
} catch (error) {
    console.error(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ok", (_req, _res) => {   _res.status(200).send(httpResponse(true, "OK", {}))   })

app.use(`/auth`, authRouter);
app.use(`${BASEURL}/review`, reviewRouter);
// app.use(`${BASEURL}/admin`, );


app.use(routeNotFound);
app.use(errorHandler);
