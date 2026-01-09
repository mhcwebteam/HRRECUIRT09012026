import React, { createContext, useState } from "react";
import 
{
  useHrhistory,
  usePersonalDetails,
  usePostPersonalDetails,
  useSubProjects,
  useUserProjects
} from "../Apis/userApi";


export const ContextData = createContext({
  projects: [],
  isProjectsLoading: true,
  subproject: [],
  isSubProjectLoading: true,
  personalData: [],
  HrData: [],
  PersonPostData: [],
  selectedRecord: null,
  setSelectedRecord: () => {},
});
export const AppProvider = ({ children }) => 
  {
  const userToken = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [selectedRecord, setSelectedRecord] = useState(null);
  // Fetchng all required data using custom hooks
  const { data, isLoading } = useUserProjects(userToken?.token);
  const {
    data: subProjects,
    isLoading: isLoadingSub} = useSubProjects(userToken?.token, data?.data?.[5]);
  const 
  {
    data: PersonalInfo,
    isLoading: isLoadingInfo,
  } = usePersonalDetails(userToken?.token);
  const { data: Hrhistory } = useHrhistory(userToken?.token);
  console.log(Hrhistory);
  const { data: Personpost } = usePostPersonalDetails(userToken?.token);
//console.log("selectedRecordselectedRecordselectedRecord",selectedRecord)
  return (
    <ContextData.Provider
      value={{
        projects: data || [],
        isProjectsLoading: isLoading,
        subproject: subProjects || [],
        isSubProjectLoading: isLoadingSub,
        personalData: PersonalInfo || [],
        HrData: Hrhistory || [],
        PersonPostData: Personpost || [],
        selectedRecord,
        setSelectedRecord,
      }}>
      {children}
    </ContextData.Provider>
  );
};
