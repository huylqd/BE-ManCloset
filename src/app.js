import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookRouter from './routers/book'
import authRouter from './routers/auth'

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api',bookRouter)
app.use('/',authRouter)

mongoose.connect(`mongodb://localhost:27017/test-node`);

export const viteNodeApp = app;
