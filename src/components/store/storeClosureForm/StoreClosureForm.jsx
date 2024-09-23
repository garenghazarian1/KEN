"use client";
import {useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useStore, } from '@/context/StoreContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from "./StoreClosureForm.module.css"

const StoreClosureDisplay = () => {
  const { setStoreClosureId, storeClosures } = useStore();
  
  const [isVisible, setIsVisible] = useState(false);
  
  const { data: session } = useSession();
  const router = useRouter();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleCreateStoreClosure = () => {
    router.push('/superuser'); 
  };

  const handleUpdateStoreClosure = (closureId) => {
    setStoreClosureId(closureId);
    router.push('/superuser'); 
  };

  const handleDeleteStoreClosure = async (closureId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this store closure? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await axios.delete(`${baseUrl}/api/storeclosures/${closureId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        setStoreClosures(storeClosures.filter(closure => closure._id !== closureId));
        alert('Store closure successfully deleted');
      } catch (error) {
        console.error('Failed to delete store closure:', error);
        alert('Failed to delete store closure');
      }
    }
  };

  const isOwner = session?.user?.role === 'owner';

  return (
    <div className={styles.container}>
      <h2 onClick={toggleVisibility} className={styles.header}>Store Closures:</h2>
      
      {isVisible && (
        <>
          {isOwner && (
            <button onClick={handleCreateStoreClosure} className={styles.button}>
              Create
            </button>
          )}
          <ul className={styles.list}>
            {storeClosures.length > 0 ? (
              storeClosures.map((closure, index) => (
                <li key={index} className={styles.listItem}>
                  <span>
                      {new Date(closure.closureDate).toLocaleDateString('en-GB', {
                       day: '2-digit', month: '2-digit', year: 'numeric'
                        })}: {closure.reason}
                  </span>

                  {isOwner && (
                    <div>
                      <button onClick={() => handleUpdateStoreClosure(closure._id)} className={styles.button}>
                        Update
                      </button>
                      <button onClick={() => handleDeleteStoreClosure(closure._id)} className={styles.button}>
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p>No store closures available.</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default StoreClosureDisplay;
