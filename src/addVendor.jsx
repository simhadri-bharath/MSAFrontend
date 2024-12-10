import React, { useState, useEffect } from "react";
import "./owner.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddVendor() {
  const [vendors, setVendors] = useState([]);
  const initialVendorFormState = {
    name: "",
    address: "",
    contactNumber: "", // Changed from phoneNumber to contactNumber
  };

  const [vendorForm, setVendorForm] = useState(initialVendorFormState);
  const [editMode, setEditMode] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleVendorInputChange = (e) => {
    const { name, value } = e.target;
    setVendorForm({ ...vendorForm, [name]: value });
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vendor`);
      setVendors(response.data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAddOrUpdateVendor = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Update vendor
        await axios.put(`${BASE_URL}/vendor/${editMode}`, vendorForm);
        setEditMode(null);
      } else {
        // Add new vendor
        await axios.post(`${BASE_URL}/vendor/addvendor`, vendorForm);
      }
      setVendorForm(initialVendorFormState);
      fetchVendors();
    } catch (error) {
      console.error("Failed to add/update vendor:", error);
    }
  };

  const handleDeleteVendor = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/vendor/vendorbyid/${id}`);
      fetchVendors();
    } catch (error) {
      console.error("Failed to delete vendor:", error);
    }
  };

  const handleEditVendor = (id) => {
    const vendorToEdit = vendors.find((vendor) => vendor.id === id);
    if (vendorToEdit) {
      setVendorForm({
        name: vendorToEdit.name,
        address: vendorToEdit.address,
        contactNumber: vendorToEdit.contactNumber, // Ensure the field name matches
      });
      setEditMode(id);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <main>
        <h2>Add Vendor</h2>
        <form onSubmit={handleAddOrUpdateVendor}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={vendorForm.name}
              onChange={handleVendorInputChange}
              required
            />
          </div>
          <div>
            <label>Address: </label>
            <input
              type="text"
              name="address"
              value={vendorForm.address}
              onChange={handleVendorInputChange}
              required
            />
          </div>
          <div>
            <label>Phone Number: </label>
            <input
              type="tel"
              name="contactNumber" // Ensure the name matches the vendorForm field
              value={vendorForm.contactNumber}
              onChange={handleVendorInputChange}
              required
            />
          </div>
          <button type="submit">
            {editMode ? "Update Vendor" : "Add Vendor"}
          </button>
        </form>

        <h2>Vendors List</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.address}</td>
                <td>{vendor.contactNumber}</td> {/* Display contactNumber */}
                <td>
                  <button onClick={() => handleEditVendor(vendor.id)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
                    style={{ backgroundColor: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}

export default AddVendor;
