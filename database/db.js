import mongoose from "mongoose";


export const dbconnection = () => {
    mongoose
        .connect(process.env.MONGO_URL, {
            dbName: "FinancialRecordManagement",
        })
        .then(() => {
            console.log("Connected to database.")
        })
        .catch((err) => {
            console.log(`Error connecting to database: ${err.message || err}`);
        });
};

