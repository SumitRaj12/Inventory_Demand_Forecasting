"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { SettingsIcon } from "lucide-react";

function Prediction() {
  const [data, setData] = useState([]); // All fetched data
  const [filteredData, setFilteredData] = useState([]); // Data filtered by user input
  const [inputValue, setInputValue] = useState(""); // User input
  const [isLoading, setIsLoading] = useState(false); // To track loading state
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReportGenerated, setIsReportGenerated] = useState(false); // To track if report is generated
  const [filter, setFilter] = useState(""); // Filter selection (store or product)
  const [searchOptions, setSearchOptions] = useState([]); // Options for the search dropdown
  const [searchValue, setSearchValue] = useState(""); // Selected value from the search dropdown
  const [Stores, setStore] = useState([]);
  const [Products, setProduct] = useState([]);
  const completePrediction = async () => {
    try {
      // Start loading
      setIsLoading(true);
      setIsDisabled(true);

      // Show loading toast
      toast.loading("Processing your file...", { id: "file-processing" });

      // If the user selects to use old data, make an Axios request to the backend
      const response = await axios.post(
        "http://localhost:3000/api/v1/sales/forecasting",
        {}, // No file data, just use old data
        {
          withCredentials: true, // Include credentials with the request
          responseType: "blob", // Expect the response to be a PDF file
        }
      );

      // Handle the download of the report as a PDF
      const url = window.URL.createObjectURL(new Blob([response.data]), {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "forecasting_report.pdf"); // Set the file name for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM

      // Show success toast
      fetchDetails();
      toast.success("Report generated successfully!");
      setIsReportGenerated(true); // Update the state to show filter and search dropdown
    } catch (error) {
      console.error("Error fetching old data:", error);
      toast.error("An error occurred while fetching the forecasting data.");
    } finally {
      toast.dismiss("file-processing"); // Close the toast with the specific ID

      setIsLoading(false); // End loading
      setIsDisabled(false); // Enable buttons again
    }
  };

  const fetchDetails = async () => {
    try {
      const resp = await axios.get(
        "http://localhost:3000/api/v1/forecast/getDetails",
        { withCredentials: true }
      );

      // Ensure the fetched data is correctly assigned to state variables
      const products = resp.data.data.products || [];
      const stores = resp.data.data.stores || [];

      // Update the state
      setProduct(products);
      setStore(stores);

      console.log(products); // Log to verify
      console.log(stores); // Log to verify
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  // Fetch data from the backend or use fallback data

  // Update filtered data when the input value changes
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredData([]);
    } else {
      const lowercasedInput = inputValue.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.product_name.toLowerCase().includes(lowercasedInput) ||
          item.store.toString().includes(lowercasedInput)
      );
      setFilteredData(filtered);
    }
  }, [inputValue, data]);

  // Handle filter selection
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    setSearchValue(""); // Reset search value when filter changes
    // Update search options based on selected filter
    if (selectedFilter === "region") {
      // const stores = [...new Set(data.map(item => item.store))]; // Unique store values
      setSearchOptions(Stores);
      console.log(Stores)
    } else if (selectedFilter === "product") {
      // const products = [...new Set(data.map(item => item.product_name))]; // Unique product names
      setSearchOptions(Products);
      console.log(Products)
    }
  };

  // Handle search value selection
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Make the backend call when both filter and search value are selected
  const fetchFilteredData = async () => {
    if (filter && searchValue) {
      setFilteredData([]);
      try {
        let response = null;
        if (filter === "region") {
          response = await axios.post(
            "http://localhost:3000/api/v1/forecast/store-forecast",
            {
              storeId: searchValue,
            },
            {
              withCredentials: true,
            }
          );
        } else {
          response = await axios.post(
            "http://localhost:3000/api/v1/forecast/product-forecast",
            {
              productName: searchValue,
            },
            {
              withCredentials: true,
            }
          );
        }
        console.log(response?.data.data);
        setFilteredData(response?.data.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        toast.error("An error occurred while fetching filtered data.");
      }
    }
  };
  const regionMap = {
    1: "North",
    2: "South",
    3: "East",
    4: "West",
  };
  
    return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 px-4 space-y-8">
        {/* Heading Section */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Sales Prediction
        </h1>
  
        {/* Button Section */}
        {!isReportGenerated && (
          <div className="flex flex-col items-center space-y-2 mb-10">
            <button
              className={`bg-green-600 text-white px-8 py-3 rounded-full text-lg hover:bg-green-700 transition-all shadow-md flex items-center gap-2 ${
                isDisabled ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={completePrediction} // Fixed function name
              disabled={isDisabled}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Get Complete Prediction"
              )}
            </button>
          </div>
        )}
  
        {/* Filter and Search Section */}
        {isReportGenerated && (
          <div className="flex flex-col items-center space-y-4 mb-10">
            {/* Filter Dropdown */}
            <select
              className="p-3 w-full max-w-md border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="">Select Filter</option>
              <option value="region">Region</option>
              <option value="product">Product</option>
            </select>
  
            {/* Search Dropdown */}
            {filter && (
              <select
                className="p-3 w-full max-w-md border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchValue}
                onChange={handleSearchChange}
              >
                <option value="">
                  Select {filter === "region" ? "Region" : "Product"}
                </option>
                {searchOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {filter === "region" ? regionMap[option] : option} {/* Fixed issue */}
                  </option>
                ))}
              </select>
            )}
  
            {/* Fetch Data Button */}
            {filter && searchValue && (
              <button
                onClick={fetchFilteredData}
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition-all shadow-md"
              >
                Search
              </button>
            )}
          </div>
        )}
  
        {/* Filtered Data */}
        {filteredData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredData.map((item) => (
              <Card key={item.productId} className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.product_name}
                </h2>
                <p>Store: {regionMap[item.storeId] || "Unknown"}</p> {/* Added fallback */}
                <p>Sales: {Math.floor(item.predicted_unit)}</p>
                <p>Month: {item.month}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
 

export default Prediction;
