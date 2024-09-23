"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./TransactionForm.module.css";
import { useStore } from '@/context/StoreContext';
import { useSession } from "next-auth/react";

const TransactionForm = () => {
  const { data: session, status } = useSession();
  const { stores } = useStore();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    store: '',
    employee: '',
    employeeName: '',
    employeeDetails: '',
    services: '',
    serviceDetailsTitle: '',
    serviceDetailsPrice: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    additionalPayments: '',
    additionalPaymentsPrice: '',
    productsName: '',
    productsPrice: '',
    discount: '',
    tax: 0.05,
    currency: 'AED',
    paymentMethod: '',
    transactionType: 'sale',
    status: 'pending',
    totalAmount: '',
    transactionDate: '',
    // invoiceNumber: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    if (formData.store) {
      fetchEmployees(formData.store);
    }
  }, [formData.store]);

  const fetchEmployees = async (storeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees?storeId=${storeId}`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      console.error('No session available');
      return;
    }

    // Convert services from a comma-separated string to an array of ObjectId strings
    // If services is an empty string, convert it to an empty array
    const formattedData = {
      ...formData,
      services: formData.services ? formData.services.split(',').map(serviceId => serviceId.trim()) : [],
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,  // Use session's accessToken
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post('http://localhost:5000/api/transactions', formattedData, config);
      console.log('Transaction created:', response.data);
      // Optionally, you can redirect or clear the form
      setFormData({
        store: '',
        employee: '',
        employeeName: '',
        employeeDetails: '',
        services: '',
        serviceDetailsTitle: '',
        serviceDetailsPrice: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        additionalPayments: '',
        additionalPaymentsPrice: '',
        productsName: '',
        productsPrice: '',
        discount: '',
        tax: 0.05,
        currency: 'AED',
        paymentMethod: '',
        transactionType: 'sale',
        status: 'pending',
        totalAmount: '',
        transactionDate: '',
        // invoiceNumber: '',
        location: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating transaction:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label>Store:</label>
        <select name="store" value={formData.store} onChange={handleChange} required>
          <option value="">Select a store</option>
          {stores.map(store => (
            <option key={store._id} value={store._id}>{store.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Employee:</label>
        <select name="employee" value={formData.employee} onChange={handleChange}>
          <option value="">Select an employee</option>
          {employees.map(employee => (
            <option key={employee._id} value={employee._id}>{employee.userInfo.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Employee Name:</label>
        <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Employee Details:</label>
        <input type="text" name="employeeDetails" value={formData.employeeDetails} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Services (comma-separated IDs):</label>
        <input type="text" name="services" value={formData.services} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Service Details Title:</label>
        <input type="text" name="serviceDetailsTitle" value={formData.serviceDetailsTitle} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Service Details Price:</label>
        <input type="number" name="serviceDetailsPrice" value={formData.serviceDetailsPrice} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Client Name:</label>
        <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Client Phone:</label>
        <input type="text" name="clientPhone" value={formData.clientPhone} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Client Email:</label>
        <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Additional Payments (comma-separated):</label>
        <input type="text" name="additionalPayments" value={formData.additionalPayments} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Additional Payments Price:</label>
        <input type="number" name="additionalPaymentsPrice" value={formData.additionalPaymentsPrice} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Products Name:</label>
        <input type="text" name="productsName" value={formData.productsName} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Products Price:</label>
        <input type="number" name="productsPrice" value={formData.productsPrice} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Discount:</label>
        <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Tax:</label>
        <input type="number" name="tax" value={formData.tax} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Currency:</label>
        <input type="text" name="currency" value={formData.currency} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Payment Method:</label>
        <input type="text" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Transaction Type:</label>
        <input type="text" name="transactionType" value={formData.transactionType} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Status:</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Total Amount:</label>
        <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Transaction Date:</label>
        <input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} />
      </div>
      {/* <div className={styles.formGroup}>
        <label>Invoice Number:</label>
        <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} />
      </div> */}
      <div className={styles.formGroup}>
        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label>Notes:</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <button type="submit" className={styles.submitButton}>Create Transaction</button>
    </form>
  );
};

export default TransactionForm;
