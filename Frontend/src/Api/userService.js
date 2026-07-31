import { axiosPrivate, axiosPublic } from "../hooks/axiosPrivate";

class userService {
  static async getUsers() {
    try {
      const res = await axiosPrivate.get(
        "/allusers"
      );
      // console.log(res)
      return res.data.users;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }
 

}

export default userService;