import { asyncHandler } from '../utils/async.handeller.js';
import { auth2client } from '../utils/googleConfig.js';
import axios from 'axios'
import User from '../models/user.model.js';

const googleLogin = asyncHandler( async (req,res) => {
    const {code} = req.query;
    const googleRes = await auth2client.getToken(code);
    auth2client.setCredentials(googleRes.tokens.access_token);

    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    )
    const { email,name,picture } = userRes.data;
    let user = await User.findOne({email});
    if(!user){
        user = await User.create({
            fullName : name,
            email,
            avatar:picture
        })
    }
    const token = user.generateJwtToken();
    return res.status(200).json({
        message:'success',
        token,
        user
    })
})

export { googleLogin }
