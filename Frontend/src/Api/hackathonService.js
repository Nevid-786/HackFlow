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
      // console.log(res.data.hackathon)
      return res.data?.hackathon;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }
  static async updateHackathon(id,body) {
    try {
    
      const res = await axiosPrivate.post(
        `/hackathon/update/${id}`,body
      );
      // console.log(res.data.hackathon)
      return res.data?.hackathon;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

    static async deleteHackaton(id) {
    try {
    
      const res = await axiosPrivate.get(
        `/hackathon/delete/${id}`
      );
      // console.log(res.data.hackathon)
      return res.data;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  
  static async get_combined_hackathons_pdf(hackathonIds) {
    try {
      const res = await axiosPrivate.post(
        "/hackathons/pdf/combined",
        { hackathonIds },
        { responseType: "blob" }
      );
      return res.data; // PDF Blob
    } catch (error) {
      const errData = error.response?.data;
      const contentType = error.response?.headers?.["content-type"] || "";

      if (errData instanceof Blob && contentType.includes("application/json")) {
        try {
          const text = await errData.text();
          throw JSON.parse(text);
        } catch {
          throw { errors: ["Something went wrong"] };
        }
      }

      throw errData || { errors: ["Something went wrong"] };
    }
  }
}

export default hack_service;