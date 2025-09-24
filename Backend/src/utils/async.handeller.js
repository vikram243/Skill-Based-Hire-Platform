const asyncHandler = (fn) => async(req,res,next) =>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code||500).json({
            success:false,
            message:error.message
        })
    }
}

// const asyncHandler = (requestHandler) => {
//     (req,res,next) => {
//         Promise.resolve(requestHandler(req,res,next))
//         .catch((err) => next(err));
//     }
// }

<<<<<<< HEAD
const asyncHandler = (requestHandler) => {

    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err));
    }
}
=======
>>>>>>> 50880371c0ac92d8fee46c5b85b287e38f56e6ca
export {asyncHandler};