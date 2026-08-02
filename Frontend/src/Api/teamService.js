import { axiosPrivate, axiosPublic } from "../hooks/axiosPrivate";

class teamService {
  static async addTeam(body) {
    try {
      const res = await axiosPrivate.post(
        "/addteam",body
      );
      ////
      return res.data
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }
 
  static async getTeams(hackid) {
    try {
      const res = await axiosPrivate.get(
        `/teams/${hackid}`
      );
      ////
      return res.data?.teams;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async getTeam(teamid) {
    try {
      const res = await axiosPrivate.get(
        `/team/${teamid}`
      );
      ////
      return res.data?.team;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }
 
 
  static async deleteTeam(teamid) {
    try {
      const res = await axiosPrivate.get(
        `/deleteteam/${teamid}`
      );
      ////
      return res.data?.teams;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async updateTeamName(teamid, name) {
    try {
      const res = await axiosPrivate.patch(
        `/team/${teamid}`,
        { name }
      );
      ////
      return res.data?.team;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async addMember(teamid,payload) {
    try {
      const res = await axiosPrivate.post(
        `/team/${teamid}/members`,
       payload
      );
      ////
      return res.data?.team;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

  static async removeMember(teamid, userId) {
    try {
      const res = await axiosPrivate.delete(
        `/team/${teamid}/members/${userId}`
      );
      ////
      return res.data?.team;
    } catch (error) {
      // re-throw the actual backend error payload, not a wrapped generic Error
      throw error.response?.data || { errors: ["Something went wrong"] };
    }
  }

}

export default teamService;