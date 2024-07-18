import express from "express";
import { addUser, userSignIn } from "../controllers/AuthControllers.js";

const AuthRoutes = express.Router()

AuthRoutes.post("/addUser",addUser)
AuthRoutes.post("/userSignIn",userSignIn)

export default AuthRoutes