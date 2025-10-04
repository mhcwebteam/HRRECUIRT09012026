import { createContext } from "react";
import { useSubProjects, useUserProjects } from "../Apis/userApi";

export const ContextData = createContext({
  projects: [],
  isProjectsLoading: true,
  subproject: [],
  isSubProjectLoading: true,
});

export const AppProvider = ({ children }) => {
  const userToken = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Fetch projects
  const { data, isLoading } = useUserProjects(userToken?.token);
  const {
    data: subProjects,    
    isLoading: isLoadingSub,  
  } = useSubProjects(userToken?.token, data?.data?.[5]);

  console.log(subProjects, "subproject11111");

  return (
    <ContextData.Provider
      value={{
        projects: data || [],
        isProjectsLoading: isLoading,
        subproject: subProjects || [],     
        isSubProjectLoading: isLoadingSub,
      }}
    >
      {children}
    </ContextData.Provider>
  );
};
