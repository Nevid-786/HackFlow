import { axiosPrivate, axiosPublic } from "../hooks/axiosPrivate";
import Cookies from "js-cookie";


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
  

  static async updateProfile(payload) {
    try {
      const res = await axiosPrivate.patch("/update/profile", payload);
      return res.data.user;
    } catch (error) {
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static logout() {
    // remove the access token cookie on client side

    try {
     const res = axiosPrivate.get("/logout");
     console.log("logout response:", res.data);
      // dispatch logout() from Redux in the component or thunk that calls this service
    } catch (e) {
      console.log(e)
      // noop
    }
  }

  // ---- admin ----

  static async getPendingUsers() {
    try {
      const res = await axiosPrivate.get("/admin/users/pending");
      return res.data.users;
    } catch (error) {
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async getAllMembers() {
    try {
      const res = await axiosPrivate.get("/admin/users");
      return res.data.users;
    } catch (error) {
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async approveUser(id) {
    try {
      const res = await axiosPrivate.patch(`/admin/users/${id}/approve`);
      return res.data.user;
    } catch (error) {
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async rejectUser(id) {
    try {
      const res = await axiosPrivate.patch(`/admin/users/${id}/reject`);
      return res.data.user;
    } catch (error) {
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async getUserProfile(id) {
    try {
      const res = await axiosPrivate.get(`/user/${id}`);
      return res.data.user;
    } catch (error) {
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async deleteUser(id) {
    try {
      const res = await axiosPrivate.get(`/delete/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

}

export default userService;