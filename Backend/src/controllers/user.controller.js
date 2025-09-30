import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../config/cloudinary.config.js';
import config from '../config/config.js'

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, number, password } = req.body;
    if (
        [firstName, lastName, email, number, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { number }]
    })

    if (existedUser) {
        throw new ApiError(409, "User Already Exists");
    }
    const avatarLocalPath = req.file?.path;
    console.log(avatarLocalPath);
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        number,
        password,
        avatar: avatar.url
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    const token = createdUser.generateJwtToken();
    if (!token) throw new ApiError(400, "error while generating the token")
    res.cookie("token", token, {
        httpOnly: true,
        secure: config.nodeEnv,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000;
    })
    return res.status(201).json(
        new ApiResponse(200, { user: createdUser, token }, "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data,
    // username or email,
    // find the user,
    // password checkPrime,
    // jwt token,
    // send cookie
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(401, "email and password are required for login");
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) throw new ApiError(401, "invalid credentials");
    const token = user.generateJwtToken();
    if (!token) throw new ApiError(400, "error while generating the token")
    res.cookie("token", token, {
        httpOnly: true,
        secure: config.nodeEnv,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(new ApiResponse(200, { user }, "user login successfully"));
})

const logoutUser = (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: config.nodeEnv, sameSite: "strict"})
    return res.status(200).json(new ApiResponse(200, {}, "user logout successfully"))
}

export {
    registerUser,
    loginUser,
    logoutUser
}