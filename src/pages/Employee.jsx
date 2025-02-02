import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SalesContext } from "@/context/salesUpdate.context";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const { role, updateRole } = useContext(SalesContext);
  const [newEmployee, setNewEmployee] = useState({
    EmployeeName: "",
    EmployeeEmail: "",
    Role: "Employee", // Default role set to "Employee"
  });
  const [isAddEmployeePage, setIsAddEmployeePage] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin/getAllEmployees",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setEmployees(response.data.employee);
      updateRole(response.data.role);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/addEmployee",
        newEmployee,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setNewEmployee({
        EmployeeEmail: "",
        EmployeeName: "",
        Role: "Employee", // Reset the role to "Employee"
      });
      setIsAddEmployeePage(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(error.response?.data.message);
    }
  };

  const handleUpdateEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/updateEmployee/${editingEmployee.EmployeeEmail}`,
        editingEmployee,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setEditingEmployee(null);
      setIsAddEmployeePage(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(error.response?.data.message);
    }
  };

  const handleDeleteEmployee = async (email) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/admin/deleteEmployee/${email}`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div
      className="employee-container"
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
      {!isAddEmployeePage ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2
              style={{
                color: "#343a40",
                fontSize: "2rem",
                marginBottom: "20px",
              }}
            >
              <b>Employee's List</b>
            </h2>
            {role ? (
              <button
                onClick={() => setIsAddEmployeePage(true)}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#008000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  marginBottom: "15px",
                  transition: "background-color 0.3s",
                }}
              >
                Add Employee +
              </button>
            ) : (
              ""
            )}
          </div>

          <table
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
                <th style={tableHeaderStyle}>S.No</th>
                <th style={tableHeaderStyle}>Employee Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Role</th> {/* Added Role column */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.EmployeeEmail}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{employee.EmployeeName}</td>
                  <td style={tableCellStyle}>{employee.EmployeeEmail}</td>
                  <td style={tableCellStyle}>{employee.Role}</td>{" "}
                  {/* Displaying Role */}
                  <td style={tableCellStyle}>
                    {role ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <button
                          onClick={() => {
                            setEditingEmployee(employee);
                            setIsAddEmployeePage(true);
                          }}
                          style={{
                            backgroundColor: "#ffc107",
                            color: "#000",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            marginRight: "10px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Update
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteEmployee(employee.EmployeeEmail)
                          }
                          style={{
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-blue-500">No Action Enabled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div style={addEmployeePageStyle}>
          <h3
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "1.5rem",
            }}
          >
            {editingEmployee ? "Update Employee" : "Add Employee"}
          </h3>
          <form
            onSubmit={
              editingEmployee
                ? handleUpdateEmployeeSubmit
                : handleAddEmployeeSubmit
            }
          >
            <label style={formLabelStyle}>
              Name:
              <input
                type="text"
                value={
                  editingEmployee
                    ? editingEmployee.EmployeeName
                    : newEmployee.EmployeeName
                }
                onChange={(e) =>
                  editingEmployee
                    ? setEditingEmployee({
                        ...editingEmployee,
                        EmployeeName: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        EmployeeName: e.target.value,
                      })
                }
                required
                style={formInputStyle}
              />
            </label>
            <label style={formLabelStyle}>
              Email:
              <input
                type="email"
                value={
                  editingEmployee
                    ? editingEmployee.EmployeeEmail
                    : newEmployee.EmployeeEmail
                }
                onChange={(e) =>
                  editingEmployee
                    ? setEditingEmployee({
                        ...editingEmployee,
                        EmployeeEmail: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        EmployeeEmail: e.target.value,
                      })
                }
                required
                style={formInputStyle}
              />
            </label>
            <label style={formLabelStyle}>
              Role:
              <select
                value={
                  editingEmployee ? editingEmployee.Role : newEmployee.Role
                }
                onChange={(e) =>
                  editingEmployee
                    ? setEditingEmployee({
                        ...editingEmployee,
                        Role: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        Role: e.target.value,
                      })
                }
                required
                style={formInputStyle}
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </select>
            </label>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </button>
            <button
              onClick={() => setIsAddEmployeePage(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      
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

const addEmployeePageStyle = {
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  maxWidth: "500px",
  margin: "auto",
  backgroundColor: "#fff",
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

export default Employee;
