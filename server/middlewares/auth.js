
import jwt from 'jsonwebtoken'

// Middleware function to decode JWT token to get clerkId
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.json({
                success: false,
                message: 'Not Authorised. Login again'
            })
        }

        const token_decode = jwt.decode(token)

        if (!token_decode || !token_decode.sub) {
            return res.json({
                success: false,
                message: 'Invalid token'
            })
        }

        req.body.clerkId = token_decode.sub

        next()

    } catch (error) {
        console.log(error.message)

        res.json({
            success: false,
            message: error.message
        })
    }
}

export default authUser

