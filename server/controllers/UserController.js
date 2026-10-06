import { Webhook } from "svix"
import userModel from '../models/userModel.js'

//API controller function to manange clerk with databse
//http://localhost:4000/api/user/webhooks
const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with Clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Verify the original raw webhook body
        const evt = whook.verify(req.body.toString(), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const { data, type } = evt

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
                res.json({ success: true })

                break
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

                res.json({ success: true })
                break
            }

            case "user.deleted": {
                await userModel.findOneAndDelete({
                    clerkId: data.id
                })

                res.json({ success: true })
                break
            }

            default:
                res.json({ success: true })
                break
        }

    } catch (error) {
        console.log(error.message)

        res.status(401).json({
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