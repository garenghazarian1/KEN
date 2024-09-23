// components/UpdateEmployee.jsx
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { baseUrl } from '@/api/ports';
import { useEmployee } from '@/context/EmployeeContext';
import styles from "./UpdateEmployee.module.css"

const UpdateEmployee = () => {
  const [formData, setFormData] = useState({
    sections: '', // Updated to focus on sections
  });
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const { currentEmployeeId } = useEmployee();
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Fetch the current employee data
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/employees/${currentEmployeeId}`, {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
          },
        });
        // Update to handle sections, ensuring it's an array before joining
        setFormData({ sections: response.data.sections?.join(', ') || '' });
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
        setError(error.response?.data?.message || 'Failed to fetch employee data');
      }
    };
  
    if (currentEmployeeId) {
      fetchEmployeeData();
    }
  }, [currentEmployeeId, session?.accessToken]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session || !currentEmployeeId) {
      setError('You must be logged in and select an employee to update.');
      return;
    }
  
    const submitData = {
      // Splitting sections by comma and trimming each entry
      sections: formData.sections.split(',').map(section => section.trim()),
    };
  
    try {
      await axios.put(`${baseUrl}/api/employees/${currentEmployeeId}`, submitData, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      alert('Employee updated successfully!');
      router.push('/superuser'); // Updated the redirection path to a more generic '/employees'
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
      console.error(err);
    }
  };
  
  // Function to toggle the form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
      <h2 onClick={toggleFormVisibility} className={styles.toggleButton}>Update Employee</h2>
      {isFormVisible && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <input  type="text"  name="sections"  placeholder="Sections (comma-separated)"  value={formData.sections}  onChange={handleChange}  required  className={styles.fileInput}
          />
          {error && <div>{error}</div>}
          <button className={styles.button} type="submit">Update Employee</button>
        </form>
      )}
    </>
  );
};

export default UpdateEmployee;
