import Axios from "axios"
import axiosInstance from './axionInstance';

const ApiURL=import.meta.env.VITE_API_URL

const registerUser=async (data)=>{
   
    try {
        const response=await Axios.post(`${ApiURL}/users/register`,{
            fullname:data.fullname,
            email:data.email,
            username:data.username,
            password:data.password,
            avatar:data.avatar[0],
            coverImage:data.coverImage[0]       //... wala syntax
        },{headers: {
            'Content-Type': 'multipart/form-data'
          }})
    
        console.log("user successfully registerd",response);
        return response.data
    } catch (error) {
        console.log(error.message);
    }
}

const loginUser=async(data)=>{
    let email
  
    if(data.username.includes("@")){
        email=data.username
        try {
            const responce=await Axios.post(`${ApiURL}/users/login`,{
                email:email,               
                password:data.password
            },{
                withCredentials:true
            })
            return responce.data   //data is responce and accesstoken
        } catch (error) {
            console.log(error.message)
        }
    } 

    
        try {
            const responce=await Axios.post(`${ApiURL}/users/login`,{
                username:data.username,               
                password:data.password               
            },{
                withCredentials:true
            })
            console.log(responce.data);
            return responce.data   //data is responce and accesstoken
        } catch (error) {
            console.log(error.message)
            throw error
        }

}

const logout=async(token)=>{
    const responce=await Axios.post(`${ApiURL}/users/logout`,{},
        {
            headers: {
        'Authoriztion': `Bearer ${token}`,
      },withCredentials:true
    })
    console.log(responce.data,"user logged out");
    return responce
}


const refreshToken = async () => {
    const response = await axiosInstance.post('/users/refresh-token', {
      refreshToken: localStorage.getItem('refreshToken')
    });
  
    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
  
    return response.data;
  };

const verifyToken=async()=>{

    const response = await Axios.get(`${ApiURL}/users/temp`,{withCredentials:true});
    if(response.data){
        return response.data
    }
    return null
    
}
  
export default{
    registerUser,
    loginUser,
    logout,
    refreshToken,
    verifyToken
}
