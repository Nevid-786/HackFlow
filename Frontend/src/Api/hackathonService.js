import { axiosPrivate, axiosPublic } from "../hooks/axiosPrivate";

class hack_service {
  static async post_hackathon(body) {
    try {
      const res = await axiosPrivate.post(
        "/addhackathon",body
      );
      return res.data;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }
  static async get_hackathons() {
    try {
    
      const res = await axiosPrivate.get(
        "/hackathons"
      );
      
      return res.data?.hackathons;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }
  static async get_hackathon(id) {
    try {
    
      const res = await axiosPrivate.get(
        `/hackathon/${id}`
      );
      console.log(res.data.hackathon)
      return res.data?.hackathon;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

}

export default hack_service;