import { createContext } from "react";
import { useHrhistory, usePersonalDetails, usePostPersonalDetails, useSubProjects, useUserProjects } from "../Apis/userApi";

export const ContextData = createContext({
  projects: [],
  isProjectsLoading: true,
  subproject: [],
  isSubProjectLoading: true,
  personalData: [],
  HrData: [],
  PersonPostData: [],

});

export const AppProvider = ({ children }) => {
  const userToken = JSON.parse(localStorage.getItem("userInfo")) || {};

  const { data, isLoading } = useUserProjects(userToken?.token);
  const {data: subProjects,    isLoading: isLoadingSub,  } = useSubProjects(userToken?.token, data?.data?.[5]);
  const {data: PersonalInfo,isLoading: isLoadingInfo} =  usePersonalDetails(userToken?.token);
const {data: Hrhistory} =  useHrhistory(userToken?.token);
const {data: Personpost} = usePostPersonalDetails(userToken.token);

 
  return (
    <ContextData.Provider
      value={{
        projects: data || [],
        isProjectsLoading: isLoading,
        subproject: subProjects || [],     
        isSubProjectLoading: isLoadingSub,
        personalData: PersonalInfo || [],
        HrData: Hrhistory || [],
        PersonPostData:Personpost || []
      }}
    >
      {children}
    </ContextData.Provider>
  );
};
