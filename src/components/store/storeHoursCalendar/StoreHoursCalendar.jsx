// components/StoreHoursDisplay.jsx
"use client";
import {  useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useStore } from '@/context/StoreContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import MyCalendar from '../reactCalender/ReactCalender';
import styles from './StoreHoursDisplay.module.css';

const StoreHoursDisplay = () => {
  const {setStoreHourId, storeHours, setStoreHours, } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleCreateStoreHour = () => {
    router.push('/superuser/');
  }
  const handleDeleteStoreHour = async (storeHourId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this store hour? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await axios.delete(`${baseUrl}/api/storehours/${storeHourId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        // Remove the deleted store hour from the local state to update the UI
        setStoreHours(storeHours.filter(hour => hour._id !== storeHourId));
        alert('Store hour successfully deleted');
      } catch (error) {
        console.error('Failed to delete store hour:', error);
        alert('Failed to delete store hour');
      }
    }
  };

  const handleUpdateStoreHour = (storeHourId) => {
    setStoreHourId(storeHourId); 
    router.push(`/superuser/`); 
  };

  const isOwner = session?.user?.role === 'owner';

  return (
    <div className={styles.container}>
      <h2 onClick={toggleVisibility} className={styles.header}>Store Opening Times:</h2>
      
      {isVisible && (
        <>
         {isOwner && (
          <button onClick={handleCreateStoreHour} className={styles.button}>
            Create
          </button>
          )}
          <ul className={styles.list}>
            {storeHours.length > 0 ? (
              storeHours.map((hour, index) => (
               
                <li key={index} className={styles.listItem}>
                  <span>{hour.day}: {hour.openTime} - {hour.closeTime}</span>
                  {isOwner && (
                    <div>
                      <button onClick={() => handleUpdateStoreHour(hour._id)} className={styles.button} >
                        Update
                      </button>
                      <button onClick={() => handleDeleteStoreHour(hour._id)} className={styles.button}>
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className={styles.noHours}>No store hours available.</p>
            )}
          </ul>
          <MyCalendar  />
        </>
      )}
      
    </div>
  );
};

export default StoreHoursDisplay;