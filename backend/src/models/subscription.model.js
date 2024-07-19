import mongoose,{Schema} from "mongoose";

const subscriptionSchema=new Schema({
    subscriber:{//who is subcribing
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    channel:{//to who is subcribing
        type:mongoose.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true
})

export const Subscription =mongoose.model("Subscription",subscriptionSchema)