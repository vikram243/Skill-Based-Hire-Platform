import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/error.handeller.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../config/cloudinary.config.js';

const registerUser = asyncHandler( async (req,res) => {
    const {firstName,lastName,email,number,password}  = req.body;
    if(
        [ firstName,lastName,email,number,password ].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email },{ number }]
    })

    if(existedUser){
        throw new ApiError(409,"User Already Exists");
    }
    const avatarLocalPath = req.file?.path;
    console.log(avatarLocalPath);
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullname : {
            firstName,
            lastName
        },
        email,
        number,
        password,
        avatar : avatar.url
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )

})

export { registerUser }