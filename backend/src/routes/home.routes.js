import { Router } from "express";

const router=Router()
const home=(req,res)=>{
    return res.json("welcome")
}
const homeRoute=router.route("").get(home)

export default router
