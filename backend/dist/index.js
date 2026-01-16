import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { regRouter } from "./routes/index.js";
import initialiser from "./ws/index.js";
const app = express();
export const server = createServer(app);
app.use(express.json());
app.use("/api", regRouter);
app.get('/', (req, res) => res.status(200).json({ message: "hello world" }));
async function startServer() {
    try {
        await mongoose.connect("mongodb://localhost:27017/chatdb", {});
        console.log("mongo server connected");
    }
    catch (error) {
        //@ts-ignore
        console.error("MongoDB error:", error.message);
        process.exit(1);
    }
    server.listen(3000, () => console.log('🚀 Server on port 3000'));
    initialiser();
}
startServer();
//# sourceMappingURL=index.js.map