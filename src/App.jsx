


import React, { createContext, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./Components/Forms/Login";
import { AppProvider } from "./Context/ContextData";
import Sidebar from "./Components/Layout/Sidebar";
import Inbox from "./Components/Inbox";
import Participant from "./Components/Participant";
import Header from "./Components/Layout/Header";
import Manpower from "./ManpowerComponent/ManPower";
import Onboarding from "./OnBoarding/Onboarding";


export const MyContext = createContext();

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const contextValues = { isSidebarOpen, setIsSidebarOpen };

  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    {
      path: '/OnBoarding',
      exact: true,
 
      element: (
     <section className='main'>
              <Header/>
        <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
        <Onboarding />
                </div>
              </div>
            </section>
          )
    },

     {
      path: '/Manpower',
      exact: true,
 

                element: (
            <section className='main'>
                 <Header/> 
              <div className='contentMain flex'>
                <div className={`sidebarWapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[90px]'} transition-all`}>
                  <Sidebar/>
                </div>
                <div className={`contentRight py-4 px-4 ${isSidebarOpen ? 'w-[82%]' : 'w-[calc(100%-90px)]'} transition-all`}>
        <Manpower />
                </div>
              </div>
            </section>
          )
    },
    
   
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <MyContext.Provider value={contextValues}>
          <RouterProvider router={router} />
        </MyContext.Provider>
      </AppProvider>
    </QueryClientProvider>
  );
}
