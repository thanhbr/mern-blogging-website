import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { 
  userRouter
} from "./routers/index.js";
import dotenv from "dotenv";
import connect from "./database/database.js";
import checkToken from "./authentication/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Maximum of request size
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());

app.use('/users', userRouter);

app.use(checkToken);
// app.use('/users', userRouter);

app.listen(PORT, async () => {
  await connect();
  console.log(`Server is running on port ${PORT}`)
})