import Axios from "axios"
const ApiURL=import.meta.env.VITE_API_URL

const userChannel=async(username)=>{
    try {
        const responce=await Axios.get(`${ApiURL}/users/c/${username}`)
        // console.log(responce);
        return responce.data
    } catch (error) {
        console.log("user related error::user channel",error);
    }
}

const getcurrentUser=async()=>{
    try {
        const responce =await Axios.post(`${ApiURL}/users/current-user`,{},{withCredentials:true})
        // console.log(responce);
        return responce.data
    } catch (error) {
        console.log("user related error:: get current user ",error);
    }
}
export default {
    userChannel,
    getcurrentUser
}
