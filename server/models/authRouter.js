import express from 'express';

import { register, login, me, logout } from '../controllers/authController.js';
import { authRateLimit } from '../middlewares/authRateLimit.js';

const authRouter=express.Router();

authRouter.post("/login", authRateLimit, login);
authRouter.post("/register", authRateLimit, register);
authRouter.get('/me', me);
authRouter.post('/logout', logout);

export default authRouter;