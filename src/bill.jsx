import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import "./bill.css";

const BillPage = () => {
  const { customer, checkout, setCartCount } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { address, city, stateField, zip } = location.state || {};

  // Fetch cart items and calculate total on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/cart?customerId=${customer.id}`
        );
        const items = response.data;
        setCartItems(items);

        // Initialize quantities for each item
        const initialQuantities = items.reduce((acc, item) => {
          acc[item.medicine.id] = item.quantity || 1; // Default quantity
          return acc;
        }, {});
        setQuantities(initialQuantities);

        // Calculate total amount
        calculateTotal(items, initialQuantities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items", error);
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      }
    };

    fetchCartItems();
  }, [customer.id, BASE_URL, navigate]);

  // Calculate total cost based on cart items and quantities
  const calculateTotal = (items, quantities) => {
    const total = items.reduce(
      (sum, item) =>
        sum +
        item.medicine.unitSellingPrice * (quantities[item.medicine.id] || 1),
      0
    );
    setTotalAmount(total);
  };

  // Handle checkout confirmation
  const handleConfirmOrder = async () => {
    try {
      await axios.post(`${BASE_URL}/cart/checkout/${customer.id}`);

      alert("Your order has been placed successfully!");
      setCartCount(0); // Reset cart count
      checkout(quantities); // Call checkout function from context
      navigate("/body/orders"); // Redirect to orders page
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("There was an error confirming your order. Please try again.");
    }
  };

  return (
    <div className="bill-page receipt">
      {loading ? (
        <p>Loading your order summary...</p>
      ) : (
        <>
          <h2 className="receipt-header">Order Summary</h2>

          <div className="receipt-section">
            <h3>Shipping Address</h3>
            <p>{address}</p>
            <p>
              {city}, {stateField} - {zip}
            </p>
          </div>

          <div className="receipt-section">
            <h3>Itemized Bill</h3>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className="bill-item">
                  <div className="item-header">
                    <span className="item-name">{item.medicine.tradeName}</span>
                    <span className="item-cost">
                      ₹
                      {item.medicine.unitSellingPrice *
                        (quantities[item.medicine.id] || 1)}
                    </span>
                  </div>
                  <div className="item-details">
                    <span>Quantity: {quantities[item.medicine.id] || 1}</span>
                    <span>
                      Price per item: ₹{item.medicine.unitSellingPrice}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>

          <div className="receipt-section total-cost">
            <h3>Total Amount: ₹{totalAmount}</h3>
          </div>

          <div className="receipt-footer">
            <button
              onClick={handleConfirmOrder}
              className="confirm-order-button"
            >
              Confirm Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BillPage;
