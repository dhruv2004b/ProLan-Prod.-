import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js'
import {connectDB} from './utils/db.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';

dotenv.config();

const app = express();
const PORT= process.env.PORT;
app.use(cookieParser()); // Middleware to parse cookies

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);

app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
    connectDB();
});