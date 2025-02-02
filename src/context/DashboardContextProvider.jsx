import { useState, useEffect } from "react";
import DashboardContext from "./DashboardContext.js";

import { Merged } from "@/data/merged_prev.js";
import { History } from "@/data/historical.js";
import axios from "axios";

function DashboardContextProvider({ children }) {
  const [merged, setMerged] = useState(Merged); // Default to Merged data
  const [history, setHistory] = useState(History); // Default to History data
  const [sales,setSales] = useState(false)
  const update=(flag)=>{setSales(flag)}
  const getDashboardData = async () => {
    try {
      // Example: Fetch data from a backend API
      const mergedResponse = await axios.get("http://localhost:3000/api/v1/sales/getDetails",{withCredentials:true});
      // const historyResponse = await axios.get("http://localhost:3000/api/history");
      // console.log(mergedResponse.data.result)
      // Set fetched data to state
      setMerged(mergedResponse.data.result || Merged); // Fallback to local data
      setHistory(mergedResponse.data.result || History); // Fallback to local data
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);

      // Use default local data in case of errors
      setMerged(Merged);
      setHistory(History);
    }
  };

  // Fetch data on initial render
  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardContext.Provider value={{ merged, history, sales,update }}>
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardContextProvider;
