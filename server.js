import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { dbconnection } from './database/db.js';
import userRoute from "./routes/userRoute.js";
import transactionRoute from './routes/transactionRoute.js'
import dashboardRoute from './routes/dashboardRoute.js'

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbconnection();

app.use("/api/users", userRoute);
app.use("/api/transactions",transactionRoute);
app.use("/api/dashboard",dashboardRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));