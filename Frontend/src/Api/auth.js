import { axiosPrivate, axiosPublic } from "../hooks/axiosPrivate";

class AuthService {
  static async login(email, password) {
    try {
      const res = await axiosPublic.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }
  static async getCurrentUser(){
    try {
        const res =await axiosPrivate.get("/getuser")
        console.log("api:",res.data.user)
        return res.data?.user
        
    } catch (error) {
        throw error.response?.data || { errors: ["Something went wrong"] };
        
    }
  }
}

export default AuthService;