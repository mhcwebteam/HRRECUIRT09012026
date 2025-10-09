import { createContext } from "react";
import { useHrhistory, usePersonalDetails, useSubProjects, useUserProjects } from "../Apis/userApi";

export const ContextData = createContext({
  projects: [],
  isProjectsLoading: true,
  subproject: [],
  isSubProjectLoading: true,
  personalData: [],
  HrData: [],

});

export const AppProvider = ({ children }) => {
  const userToken = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Fetch projects
  const { data, isLoading } = useUserProjects(userToken?.token);
  const {data: subProjects,    isLoading: isLoadingSub,  } = useSubProjects(userToken?.token, data?.data?.[5]);
  const {data: PersonalInfo,isLoading: isLoadingInfo} =  usePersonalDetails(userToken?.token);
const {data: Hrhistory} =  useHrhistory(userToken?.token);

console.log(userToken.token,"token!!!!");
 
  return (
    <ContextData.Provider
      value={{
        projects: data || [],
        isProjectsLoading: isLoading,
        subproject: subProjects || [],     
        isSubProjectLoading: isLoadingSub,
        personalData: PersonalInfo || [],
        HrData: Hrhistory || []
      }}
    >
      {children}
    </ContextData.Provider>
  );
};
