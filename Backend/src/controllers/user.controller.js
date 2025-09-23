import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError } from '../utils/error.handeller.js'

const registerUser = asyncHandler( async (req,res) => {
    const {fullname,email,number,password,avatar}  = req.body;
    if(
        [ fullname,email,number,password,avatar ].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    
})

export { registerUser }