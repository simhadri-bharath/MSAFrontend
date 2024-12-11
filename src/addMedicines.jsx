// AddMedicines.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./owner.css";
import { useNavigate } from "react-router-dom";

const AddMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  console.log("BASE_URL:", BASE_URL);

  const initialMedicineFormState = {
    code: "MED0001",
    tradeName: "Paracetamol",
    genericName: "Acetaminophen",
    expiryDate: "2025-12-31",
    quantity: 100,
    unitPurchasePrice: 10,
    unitSellingPrice: 20,
    imageUrl: "https://example.com/paracetamol.jpg",
  };

  const [medicineForm, setMedicineForm] = useState(initialMedicineFormState);

  const handleMedicineInputChange = (e) => {
    const { name, value } = e.target;
    setMedicineForm({ ...medicineForm, [name]: value });
  };

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/medicine`);
      setMedicines(response.data);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAddOrUpdateMedicine = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${BASE_URL}/medicine/${editMode}`, medicineForm);
        setEditMode(null);
      } else {
        await axios.post(`${BASE_URL}/medicine/addmedicine`, medicineForm);
      }
      setMedicineForm(initialMedicineFormState);
      fetchMedicines();
    } catch (error) {
      console.error("Failed to add/update medicine:", error);
    }
  };

  const handleEditMedicine = (id) => {
    const medicineToEdit = medicines.find((medicine) => medicine.id === id);
    if (medicineToEdit) {
      setMedicineForm(medicineToEdit);
      setEditMode(medicineToEdit.id);
    } else {
      console.error("Medicine not found for editing.");
    }
  };

  const handleDeleteMedicine = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/medicine/medicinebyid/${id}`);
      fetchMedicines();
    } catch (error) {
      console.error("Failed to delete medicine:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <main>
        <h2>{editMode ? "Update Medicine" : "Add Medicine"}</h2>
        <form onSubmit={handleAddOrUpdateMedicine}>
          <div>
            <label>Code: </label>
            <input
              type="text"
              name="code"
              value={medicineForm.code}
              onChange={handleMedicineInputChange}
              required
              disabled={editMode} // Disable code field during edit
            />
          </div>
          <div>
            <label>Trade Name: </label>
            <input
              type="text"
              name="tradeName"
              value={medicineForm.tradeName}
              onChange={handleMedicineInputChange}
              required
            />
          </div>
          <div>
            <label>Generic Name: </label>
            <input
              type="text"
              name="genericName"
              value={medicineForm.genericName}
              onChange={handleMedicineInputChange}
              required
            />
          </div>
          <div>
            <label>Expiry Date: </label>
            <input
              type="date"
              name="expiryDate"
              value={medicineForm.expiryDate}
              onChange={handleMedicineInputChange}
              required
            />
          </div>
          <div>
            <label>Quantity: </label>
            <input
              type="number"
              name="quantity"
              value={medicineForm.quantity}
              onChange={handleMedicineInputChange}
              required
            />
          </div>
          <div>
            <label>Unit Purchase Price: </label>
            <input
              type="text"
              name="unitPurchasePrice"
              value={medicineForm.unitPurchasePrice}
              onChange={handleMedicineInputChange}
              required
            />
          </div>
          <div>
            <label>Unit Selling Price: </label>
            <input
              type="text"
              name="unitSellingPrice"
              value={medicineForm.unitSellingPrice}
              onChange={handleMedicineInputChange}
              required
            />
          </div>
          <div>
            <label>Image URL: </label>
            <input
              type="text"
              name="imageUrl"
              value={medicineForm.imageUrl}
              onChange={handleMedicineInputChange}
              required
            />
          </div>
          <button type="submit">
            {editMode ? "Update Medicine" : "Add Medicine"}
          </button>
        </form>

        <h2>Medicines List</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Code</th>
              <th>Trade Name</th>
              <th>Generic Name</th>
              <th>Expiry Date</th>
              <th>Quantity</th>
              <th>Unit Purchase Price</th>
              <th>Unit Selling Price</th>
              <th>Image</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.code}</td>
                <td>{medicine.tradeName}</td>
                <td>{medicine.genericName}</td>
                <td>{medicine.expiryDate}</td>
                <td>{medicine.quantity}</td>
                <td>{medicine.unitPurchasePrice}</td>
                <td>{medicine.unitSellingPrice}</td>
                <td>
                  <img
                    src={medicine.imageUrl}
                    alt={medicine.tradeName}
                    width="50"
                  />
                </td>
                <td>
                  <button onClick={() => handleEditMedicine(medicine.id)}>
                    Update
                  </button>
                </td>
                <td>
                  <button
                    style={{ backgroundColor: "red" }}
                    onClick={() => handleDeleteMedicine(medicine.id)}
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
};

export default AddMedicines;
