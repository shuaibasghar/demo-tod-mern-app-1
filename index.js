import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
//connect db
const dbConnect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/todo-practice-demo");
        console.log("Database Connected");
    } catch (error) {
        console.log(error.message);
    }
};
dbConnect();

//add path to dist build folder of frontend
app.use(express.static("frontend/demo-todo/dist"));

//user model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const userModel = mongoose.model("user", userSchema);
//modals
const todoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
const todoModel = mongoose.model("todoDemo", todoSchema);

app.get("/", (req, res) => {
    res.send("<h1>HI, Server is running</h1>");
});

//user controllers

//register user
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const isUser = await userModel.findOne({ email });
        if (isUser)
            return res.status(400).json({ error: "User already exists" });
        const user = await userModel.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });
        const token = await jwt.sign({ id: user.id }, "secretisthis", {
            expiresIn: "7d",
        });

        res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true, // Makes the cookie inaccessible to JavaScript in the browser (helps prevent XSS attacks)
        });

        res.status(201).json({ token, user, message: "User Registered" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//login user
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid Credentials" });
        const token = await jwt.sign({ id: user.id }, "secretisthis", {
            expiresIn: "7d",
        });
        res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });
        res.status(200).json({ token, user, message: "Login Success" });
    } catch (error) {
        res.status(500).json({ error: " Internal Server Error " });
    }
});
//crud operations for todo list

const authMiddleware = async (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) return res.status(401).json({ error: "Please Login" });
    try {
        const decodeToken = await jwt.verify(accessToken, "secretisthis");

        req.userId = decodeToken.id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Please Login" });
    }
};
app.get("/logout", async (req, res) => {
    try {
        res.cookie("accessToken", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({ message: "Logout Success" });
    } catch (error) {
        responseReturn(res, 500, { error: "Internal Server Error" });
    }
});
//create todo
app.post("/todo", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { title, description } = req.body;
        const todoos = await todoModel.create({
            title,
            description,
            userId,
        });
        // console.log({ title, description, userId });

        res.status(201).json({ todoos, message: "Todo Created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get all todos
app.get("/todo", authMiddleware, async (req, res) => {
    try {
        const todos = await todoModel.find({ userId: req.userId });
        res.status(200).json({ todos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE todo
app.put("/todo/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req;
        const isTodo = await todoModel.findOne({ _id: id, userId: userId });
        if (!isTodo) return res.status(404).json({ error: "todo not found" });
        await todoModel.findByIdAndUpdate(id, req.body, {
            new: true, //return updated data
        });
        res.status(200).json({ message: "Todo Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

//delete todo
app.delete("/todo/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const isTodo = await todoModel.findById(id, { userId: req.userId });
        if (!isTodo) return res.status(404).json({ error: "todo not found" });
        await todoModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Todo Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get todo by id
app.get("/todo/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await todoModel.findOne({ _id: id, userId: req?.userId });
        if (!todo) return res.status(404).json({ error: "todo not found" });
        res.status(200).json({ todo });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
