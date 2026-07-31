import jwt from "jsonwebtoken"




export const generateTokens=(user)=>{
    const accessToken =jwt.sign(
        {
            _id:user._id,
             name:user.name,
            email:user.email,
            role:user.role||"user",
            profilePicture:user.profilePicture
        }
        ,process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN}

    )
    
        const refreshToken =jwt.sign(
        {
            _id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
        }
        ,process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN}

    )
    return { accessToken, refreshToken }

}