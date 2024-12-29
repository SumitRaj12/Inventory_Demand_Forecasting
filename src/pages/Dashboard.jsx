import { BarChart } from "@/components/BarChart";
import { HistoryChart } from "@/components/HistoryChart";
import { PieChart } from "@/components/PieChart";
import DashboardContextProvider from "@/context/DashboardContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function Dashboard() {
  const [highlights, setHighlight] = useState({
    totalProduct: "",
    totalCustomer: "",
    totalItems: "",
  });

  const fetchData = async () => {
    try {
      const resp = await axios.get(
        "http://localhost:3000/api/v1/sales/dashboard",
        { withCredentials: true }
      );
      const data = resp.data.data;
      setHighlight({
        totalCustomer: data.totalCustomer,
        totalProduct: data.totalProduct,
        totalItems: data.totalItems,
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardContextProvider>
      <div className="flex flex-col space-y-8 px-4">
        {/* Header Section */}
        <div className="w-full flex flex-col max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans text-start">
            Dashboard
          </h1>
          <hr className="my-4 w-full border-gray-300" />
        </div>

        {/* Highlights Section */}
        <div className="flex justify-between items-center max-w-5xl mx-auto gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg w-full md:w-1/4 shadow-lg">
            <h2 className="text-lg font-bold">Total Products</h2>
            <p className="text-2xl">{highlights.totalProduct}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg w-full md:w-1/4 shadow-lg">
            <h2 className="text-lg font-bold">Total Customers</h2>
            <p className="text-2xl">{highlights.totalCustomer}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg w-full md:w-1/4 shadow-lg">
            <h2 className="text-lg font-bold">Total Items</h2>
            <p className="text-2xl">{highlights.totalItems}</p>
          </div>
        </div>

        {/* Power BI Section */}
        <div className="w-full mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
          {/* <h2 className="text-2xl font-semibold mb-4">Sales Dashboard</h2> */}
          <iframe
            title="Stoksage_Dashboard"
            src="https://app.powerbi.com/reportEmbed?reportId=d3c3d51d-ba38-435e-b2be-7ba9e50d9d89&autoAuth=true&ctid=989bd926-7d97-4eca-8a90-83492821bed1"
            frameBorder="0"
            allowFullScreen="true"
            className="w-full h-[600px] rounded-lg border border-gray-300"
          ></iframe>
        </div>
      </div>
    </DashboardContextProvider>
  );
}

export default Dashboard;



// Summary Cards Section
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
//           {/* Card: Total Sales */}
//           <div className="flex flex-col text-center text-black p-6 font-sans border-4 rounded-lg shadow-xl bg-white">
//             <h1 className="text-2xl font-bold">{highlights.totalItems}</h1>
//             <h2 className="text-green-600">Items Sold</h2>
//           </div>

//           {/* Card: Total Products */}
//           <div className="flex flex-col text-center text-black p-6 font-sans border-4 rounded-lg shadow-xl bg-white">
//             <h1 className="text-2xl font-bold">{highlights.totalProduct}</h1>
//             <h2 className="text-green-600">Total Products</h2>
//           </div>

//           {/* Card: Total Customers */}
//           <div className="flex flex-col text-center text-black p-6 font-sans border-4 rounded-lg shadow-xl bg-white">
//             <h1 className="text-2xl font-bold">{highlights.totalCustomer}</h1>
//             <h2 className="text-green-600">Total Customers</h2>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
//           <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-md">
//             <BarChart />
//           </div>

//           <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-md ">
//             <PieChart />
//           </div>

//           {/* history using barchat  */}
//           <div>
//               <HistoryChart />
//           </div>
//         </div>