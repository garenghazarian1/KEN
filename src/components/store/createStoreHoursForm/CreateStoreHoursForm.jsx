"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '@/context/StoreContext';
import { baseUrl } from '@/api/ports'; 
import { useSession } from 'next-auth/react';
import styles from './StoreHoursForm.module.css';

const CreateStoreHoursForm = () => {
  const { data: session } = useSession();
  const { currentStoreId } = useStore();
  const [day, setDay] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!day || !openTime || !closeTime) {
      setError('Please fill in all fields.');
      return;
    }

    // Ensure session token exists
    if (!session || !session.accessToken) {
      setError('You must be logged in to perform this action.');
      return;
    }
    try {
        const config = {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            },
          };
      await axios.post(`${baseUrl}/api/storehours`, {
        store: currentStoreId,
        day,
        openTime,
        closeTime,
      }, config);

      setSuccess('Store hours added successfully!');
      // Clear the form fields after successful submission
      setDay('');
      setOpenTime('');
      setCloseTime('');
    } catch (error) {
      console.error('Failed to create store hours:', error);
      setError(error.response && error.response.data.message ? error.response.data.message : 'Failed to add store hours. Please try again.');
    }
  };
      
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
    <h2 onClick={toggleFormVisibility} className={styles.toggleButton}>create store open days hours</h2>
    {isFormVisible && (
    <form onSubmit={handleSubmit} className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <div>
        <label htmlFor="day" className={styles.label}>Day</label>
            <select  id="day"  value={day}  onChange={(e) => setDay(e.target.value)}  className={styles.inputStyle}  > 
                <option value="">Select a day</option> <option value="Monday">Monday</option> <option value="Tuesday">Tuesday</option> <option value="Wednesday">Wednesday</option> <option value="Thursday">Thursday</option> <option value="Friday">Friday</option> <option value="Saturday">Saturday</option> <option value="Sunday">Sunday</option>
            </select>
       </div>
      <div>
        <label htmlFor="openTime" className={styles.label}>Open Time</label>
        <input type="time" id="openTime" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className={styles.inputStyle}/>
      </div>
      <div>
        <label htmlFor="closeTime" className={styles.label}>Close Time</label>
        <input type="time" id="closeTime" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className={styles.inputStyle}/>
      </div>
      <button type="submit" className={styles.button}>Add Store Hours</button>
    </form>
    )}
    </>
  );
};

export default CreateStoreHoursForm;
