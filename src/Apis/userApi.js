import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../Config/Config";


export const useUserProjects = (token) =>
  useQuery({
    queryKey: ["projects", token],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/project`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data),
    enabled: !!token,
  });


export const useSubProjects = (token, project) => {

  return useQuery({
    queryKey: ["subProjects", token, project],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/subProject/${project}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data; 
    },
    enabled: !!token && !!project, 
  });
};



