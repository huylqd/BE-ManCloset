import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app: any = express();

app.use(express.json());
app.use(cors());

mongoose.connect(`mongodb://localhost:27017/test-node`);

const port = 8088;
app.listen(port, () => {
  console.log(`App is running at the ${port}`);
});
export const viteNodeApp = app;
