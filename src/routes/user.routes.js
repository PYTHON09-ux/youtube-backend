import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import multer from "multer";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router()


router.route('/register').post(
    
    upload.fields([
        {
            name:'avatar',
            maxCount:1
        },

        {
            name:'coverImage',
            maxCount:1
        }
    ])
    ,registerUser
)


router.route('/login').post(loginUser)

// secured routes

router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refreshToken').post(refreshAccessToken)
router.route('/changePassword').post(verifyJWT, changeCurrentPassword)
router.route('/getCurrentUser').get(verifyJWT, getCurrentUser)
router.route('/updateAccountDetails').patch(verifyJWT, updateAccountDetails)
router.route('/updateUserAvatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar)
router.route('/updateUserCoverImage').patch(verifyJWT, upload.single('coverImage'),updateUserCoverImage)
router.route('/c/:username').get(verifyJWT, getChannelUserProfile)
router.route('/history').get(verifyJWT, getWatchHistory)


export default router
