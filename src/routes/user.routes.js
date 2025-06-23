import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {uoload} from '../middlewares/multer.middleware.js'
import multer from "multer";

const router= Router()


router.route('/register').post(
    
    multer.fields([
        {
            name:'avatar',
            maxCount:1
        },

        {
            image:'coverImage',
            maxCount:1
        }
    ])
    ,registerUser
)

export default router