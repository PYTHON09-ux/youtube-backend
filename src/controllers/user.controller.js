import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new apiError(500, "Something went wrong while generating referesh and access token")
    }
}



const registerUser = asyncHandler(async (req, res) => {

    // 1st get users from frontend
    // 2nd validation- not empty
    // 3rd check if user already exits - check using username and email
    // 4th check for images, check for avatar
    // 5th upload them to cloudinary , avatar
    // 6th create user object - create entry in db 
    // 7th remove password and refresh token field from response 
    // 8th check for user creation 
    // 9th return response 

    const { userName, email, fullName, password } = req.body;

    if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {

        throw new apiError(400, 'all fields are compulsory')
    }

    const exitedUser = await User.findOne(
        {
            $or: [{ userName }, { email }]
        }
    )

    if (exitedUser) throw new apiError(409, 'user is already exits')

    console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log('from cloudinary', avatar)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) throw new apiError(500, 'something went wrong while registering user')

    return res.status(201).json(
        new apiResponse(200, createdUser, 'user register successfully')
    )

})

const loginUser = asyncHandler(async (req, res) => {

    // req body -> data
    // username or email
    // find the user
    // check the password
    // access and refresh token 
    // send cookie

    const { email, userName, password } = req.body

    if (!userName && !email) {
        throw new apiError(400, 'username or email is required')
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) throw new apiError(404, 'user does not exist')

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) throw new apiError(400, 'invalid credentials')

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await user.findById(user._id).select('-password, -refreshToken')

    const option = {
        httpOnly: true,
        secure: true
    }

    return res 
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new apiResponse(
            200,
            {
                user:loggedInUser, accessToken, refreshToken
            },
            'user loggedIn successfully'
        )
    )

})

const logoutUser= asyncHandler(async(req, res)=>{
    
    User.findByIdAndUpdate(
       await req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
            {
                new:true
            }
    
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out"))
})


export {
    registerUser,
    loginUser,
    logoutUser
}