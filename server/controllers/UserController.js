import { Webhook } from "svix"
import userModel from '../models/userModel.js'

//API controller function to manange clerk with databse
//http://localhost:4000/api/user/webhooks
const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        const payload = req.body.toString()

        whook.verify(payload, {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"]
})

const { data, type } = JSON.parse(payload)

        switch (type) {

            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await userModel.create(userData)

                return res.json({ success: true })
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await userModel.findOneAndUpdate(
                    { clerkId: data.id },
                    userData
                )

                return res.json({ success: true })
            }

            case "user.deleted": {
                await userModel.findOneAndDelete({
                    clerkId: data.id
                })

                return res.json({ success: true })
            }

            default:
                return res.json({ success: true })
        }

    } catch (error) {
        console.log("Webhook error:", error.message)

        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

//API COntroller function to get user available credits data
const userCredits = async (req,res) =>{
    try{
        const {clerkId} = req.body
        const userData = await userModel.findOne({clerkId})

        res.json({success:true,credits: userData.creditBalance})

    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
        
    }
}

export {clerkWebhooks, userCredits}