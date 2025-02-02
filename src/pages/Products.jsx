import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Papa from "papaparse"; // For parsing CSV files

const Product = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    productName: "",
    region:"",
    totalStock: "",
    pricePerUnit: "",
  });
  // State to hold the selected filter value
  const [selectedFilter, setSelectedFilter] = useState("");

  // Change handler for the select input
  const handleFilterChange = async (event) => {
    setSelectedFilter(event.target.value);
    // Optionally, you can perform additional actions based on the selection.
    // console.log("Selected Filter:", event.target.value);
    if (event.target.value != "") {
      try {
        const resp = await axios.post(
          "http://localhost:3000/api/v1/product/fetchStoreStock",
          { region: event.target.value },
          { withCredentials: true }
        );
        const products = resp.data.products;
        setProducts(products)
        toast.success(resp.data.message);
      } catch (error) {
        toast.error(error?.response.data.message);
      }
    }
    else fetchProducts();
  };

  const [trigger, setTrigger] = useState(false);
  const [isAddProductPage, setIsAddProductPage] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stores, setStores] = useState([]);
  const rowsPerPage = 10;

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/product/getAllProducts",
        {
          withCredentials: true,
        }
      );
      setProducts(response.data.products || []);
      setStores(response.data.stores || []);
      console.log(response.data.stores)
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  // Calculate pagination values
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProducts = products.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(products.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleBackPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };
  // Handle CSV file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file); // The key name should match the backend

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/product/uploadCSV", // Endpoint for CSV upload
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
          withCredentials: true, // Include credentials if necessary
        }
      );
      toast.success(response.data.message || "CSV uploaded successfully!");
      setTrigger(!trigger); // Refresh the product list
      fetchProducts(); // Fetch updated product list
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error(error.response?.data?.message || "Failed to upload CSV.");
    }
  };

  // Add a product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/product/createProduct",
        newProduct,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setNewProduct({
        productId: "",
        productName: "",
        totalStock: "",
        pricePerUnit: "",
        region:""
      });
      setIsAddProductPage(false);
      setTrigger(!trigger);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data.message);
    }
  };

  // Update a product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/product/updateProduct/${editingProduct.productId}`,
        editingProduct,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setEditingProduct(null);
      setIsAddProductPage(false);
      setTrigger(!trigger);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data.message);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/product/deleteProduct/${productId}`,
        {
          withCredentials: true,
        }
      );
      setTrigger(!trigger);
      toast.success(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [trigger]);

  return (
    <div style={containerStyle} className="w-full">
      {!isAddProductPage ? (
        <>
          <div style={headerStyle}>
            <h2 style={titleStyle}>
              <b>Product List</b>
            </h2>
            <div>
              <button
                onClick={() => setIsAddProductPage(true)}
                style={addButtonStyle}
              >
                Add Product +
              </button>
              <label style={uploadLabelStyle}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload} // Attach the correct handler
                  style={{ display: "none" }}
                />
                Upload CSV
              </label>
            </div>
          </div>

          <div className="my-4">
            <h3 className="font-bold text-lg mb-2">Stores</h3>
            <select
              value={selectedFilter} // To reflect the current value in the select
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" key="">
                OverAll
              </option>
              {stores.map((store, index) => (
                <option key={index} value={store.region}>
                  {store.region}
                </option>
              ))}
            </select>
          </div>

          <div>
            {currentProducts.length>0 ? <table style={tableStyle}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th style={tableCellStyle}>S.No</th>
                <th style={tableCellStyle}>Product ID</th>
                <th style={tableCellStyle}>Name</th>
                <th style={tableCellStyle}>Stock</th>
                <th style={tableCellStyle}>Price/Unit</th>
                <th style={tableCellStyle}>Region</th>
                <th style={tableCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={product.productId}>
                  <td style={tableCellStyle}>{indexOfFirstRow + index + 1}</td>
                  <td style={tableCellStyle}>{product.productId}</td>
                  <td style={tableCellStyle}>{product.productName}</td>
                  <td style={tableCellStyle}>{product.totalStock || product.storeStock}</td>
                  <td style={tableCellStyle}>{product.pricePerUnit}</td>
                  <td style={tableCellStyle}>{product.region}</td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsAddProductPage(true);
                        }}
                        style={updateButtonStyle}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.productId)}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>:(<div className="flex justify-center items-center text-gray-700"><p>No Data to Display</p></div>)}
          </div>

          {/* Pagination Controls */}
          <div style={paginationStyle}>
            <button
              onClick={handleBackPage}
              disabled={currentPage === 1}
              style={paginationButtonStyle}
            >
              Back
            </button>
            <span style={paginationInfoStyle}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={paginationButtonStyle}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div style={addProductPageStyle}>
          <h3 style={formTitleStyle}>
            {editingProduct ? "Update Product" : "Add Product"}
          </h3>
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          >
            <label style={formLabelStyle}>
              Product ID:
              <input
                type="text"
                value={
                  editingProduct
                    ? editingProduct.productId
                    : newProduct.productId
                }
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        productId: e.target.value,
                      })
                    : setNewProduct({
                        ...newProduct,
                        productId: e.target.value,
                      })
                }
                required
                style={formInputStyle}
                disabled={editingProduct !== null}
              />
            </label>
            <label style={formLabelStyle}>
              Product Name:
              <input
                type="text"
                value={
                  editingProduct
                    ? editingProduct.productName
                    : newProduct.productName
                }
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        productName: e.target.value,
                      })
                    : setNewProduct({
                        ...newProduct,
                        productName: e.target.value,
                      })
                }
                required
                style={formInputStyle}
              />
            </label>
            <label style={formLabelStyle}>
              Total Stock:
              <input
                type="number"
                value={
                  editingProduct
                    ? editingProduct.totalStock
                    : newProduct.totalStock
                }
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        totalStock: e.target.value,
                      })
                    : setNewProduct({
                        ...newProduct,
                        totalStock: e.target.value,
                      })
                }
                required
                style={formInputStyle}
              />
            </label>
            <label style={formLabelStyle}>
              Price/Unit:
              <input
                type="number"
                value={
                  editingProduct
                    ? editingProduct.pricePerUnit
                    : newProduct.pricePerUnit
                }
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        pricePerUnit: e.target.value,
                      })
                    : setNewProduct({
                        ...newProduct,
                        pricePerUnit: e.target.value,
                      })
                }
                required
                style={formInputStyle}
              />
            </label>
            <label style={formLabelStyle}>
              Region:
              <input
                type="text"
                value={
                  editingProduct
                    ? editingProduct.region
                    : newProduct.region
                }
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        region: e.target.value,
                      })
                    : setNewProduct({
                        ...newProduct,
                        region: e.target.value,
                      })
                }
                required
                style={formInputStyle}
              />
            </label>
            <button type="submit" style={submitButtonStyle}>
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
            <button
              onClick={() => setIsAddProductPage(false)}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// Styles for Pagination
const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
};

const paginationButtonStyle = {
  padding: "10px 16px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
  margin: "0 10px",
  transition: "background-color 0.3s",
  disabled: {
    backgroundColor: "#ddd",
    cursor: "not-allowed",
  },
};

const paginationInfoStyle = {
  fontSize: "1rem",
  fontWeight: "bold",
};
// Styles
const containerStyle = {
  padding: "20px",
  fontFamily: "'Roboto', sans-serif",
  maxWidth: "FULL",
  margin: "0 auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const titleStyle = {
  color: "#343a40",
  fontSize: "2rem",
  marginBottom: "20px",
};

const addButtonStyle = {
  padding: "10px 16px",
  backgroundColor: "#008000",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
  marginBottom: "15px",
  transition: "background-color 0.3s",
};

const uploadLabelStyle = {
  padding: "10px 16px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
  marginLeft: "10px",
  display: "inline-block",
  textAlign: "center",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  borderRadius: "8px",
  overflow: "hidden",
};

const tableHeaderStyle = {
  backgroundColor: "#007BFF",
  color: "#fff",
};

const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #ddd",
};

const updateButtonStyle = {
  backgroundColor: "#ffc107",
  color: "#000",
  padding: "5px 10px",
  borderRadius: "5px",
  marginRight: "10px",
  border: "none",
  cursor: "pointer",
};

const deleteButtonStyle = {
  backgroundColor: "#dc3545",
  color: "#fff",
  padding: "5px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
};

const addProductPageStyle = {
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  maxWidth: "500px",
  margin: "auto",
  backgroundColor: "#fff",
};

const formTitleStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "1.5rem",
};

const formLabelStyle = {
  display: "block",
  margin: "10px 0",
};

const formInputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ddd",
};

const submitButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

const cancelButtonStyle = {
  backgroundColor: "gray",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
  marginTop: "10px",
  marginLeft: "10px",
};

export default Product;
