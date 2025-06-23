import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'


const registerUser= asyncHandler( async (req, res)=>{
    
    // 1st get users from frontend
    // 2nd validation- not empty
    // 3rd check if user already exits - check using username and email
    // 4th check for images, check for avatar
    // 5th upload them to cloudinary , avatar
    // 6th create user object - create entry in db 
    // 7th remove password and refresh token field from response 
    // 8th check for user creation 
    // 9th return response 

    const{userName, email, fullName, Password}= req.body;

    if([fullName, email, userName, Password].some((field)=> field.trim()=== "")){

        throw new apiError(400, 'all fields are compulsory')
    }

   const exitedUser= User.findOne(
        {
            $or:[{userName}, {email}]
        }
    )

    if(exitedUser) throw new apiError(409, 'user is already exits')

    const avatarLocalPath= req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

      if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user= await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        Password,
        userName: userName.toLowerCase()
    })

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new apiError(500, 'something went wrong while registering user')

    return res.status(201).json(
        new apiResponse(200,createdUser, 'user register successfully')
    )

}) 


export {
        registerUser
    }