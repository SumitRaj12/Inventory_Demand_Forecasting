import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SalesContext } from "@/context/salesUpdate.context.jsx";

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // To track the current page
  const {Sales,update} = useContext(SalesContext);
  const fetchSalesData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/sales/getAllDetails",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setSalesData(response.data.sales);
      if(response.data.sales.length>0) update(true)
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/sales/create-csv-sales",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setFile(null);
      fetchSalesData();
      update(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.response?.data.message || "File upload failed");
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(salesData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const currentSalesData = salesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <div
      className="sales-container"
      style={{
        padding: "20px",
        fontFamily: "'Roboto', sans-serif",
        maxWidth: "full",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2
          style={{
            color: "#343a40",
            fontSize: "2rem",
            marginBottom: "20px",
          }}
        >
          <b>Sales Data</b>
        </h2>
        <form
          onSubmit={handleFileUpload}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              padding: "5px",
              marginRight: "10px",
              fontSize: "1rem",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              backgroundColor: "#008000",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background-color 0.3s",
            }}
          >
            Upload
          </button>
        </form>
      </div>

      <div style={{ overflowX: "hidden" }}>
      {/*  */}
        {currentSalesData.length > 0?(<table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#007BFF", color: "#fff" }}>
            <tr>
              <th style={tableHeaderStyle}>Product ID</th>
              <th style={tableHeaderStyle}>Product Name</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Month</th>
              <th style={tableHeaderStyle}>Units Sold</th>
              <th style={tableHeaderStyle}>Sales</th>
              {/* <th style={tableHeaderStyle}>WeekDay</th> */}
              <th style={tableHeaderStyle}>Festival</th>
              <th style={tableHeaderStyle}>Promotion</th>
              <th style={tableHeaderStyle}>Price/Product</th>
              <th style={tableHeaderStyle}>Ad Spent</th>
              {/* <th style={tableHeaderStyle}>Weather</th> */}
              <th style={tableHeaderStyle}>Customer Segment</th>
              <th style={tableHeaderStyle}>Region</th>
            </tr>
          </thead>
          <tbody>
            {currentSalesData.map((sale, index) => (
              <tr key={index}>
                {/* <td style={tableCellStyle}>{(currentPage - 1) * itemsPerPage + index + 1}</td> */}
                <td style={tableCellStyle}>{sale.productId}</td>
                <td style={tableCellStyle}>{sale.productName}</td>
                <td style={tableCellStyle}>{sale.date}</td>
                <td style={tableCellStyle}>{sale.month}</td>
                <td style={tableCellStyle}>{sale.unitsSold}</td>
                <td style={tableCellStyle}>{sale.sales}</td>
                {/* <td style={tableCellStyle}>{sale.weekday}</td> */}
                <td style={tableCellStyle}>{(sale.festival)?"Yes":"No"}</td>
                <td style={tableCellStyle}>{(sale.promotion)?"No":"Yes"}</td>
                <td style={tableCellStyle}>{sale.pricePerUnit}</td>
                <td style={tableCellStyle}>{sale.adSpent}</td>
                {/* <td style={tableCellStyle}>{sale.weather}</td> */}
                <td style={tableCellStyle}>{sale.customerSegment}</td>
                <td style={tableCellStyle}>{sale.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ):(<div className="flex justify-center items-center text-center h-full"><p className="text-gray-700 ">No Data to Display</p></div>)}
      </div>
      {currentSalesData.length>0?(<div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={paginationButtonStyle}
        >
          Back
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={paginationButtonStyle}
        >
          Next
        </button>
      </div>):("")}
      
    </div>
  );
};

const tableHeaderStyle = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #ddd",
};

const paginationButtonStyle = {
  padding: "10px 16px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "background-color 0.3s",
  opacity: 0.7,
};

export default Sales;
