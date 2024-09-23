"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useSession } from 'next-auth/react';
import { useStore } from "@/context/StoreContext"
import Image from 'next/image';
import styles from './UpdateStore.module.css';

const UpdateStoreForm = () => {
  const [storeData, setStoreData] = useState({  name: '',  street: '',  city: '',  state: '',  zipCode: '',  country: '',  phone: '',  mobile: '',mobileOne:'',  email: '',  imageStore: '', });
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: session, status } = useSession();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { currentStoreId } = useStore();
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      //console.log("Current storeId from global state:", currentStoreId);
      try {
        const response = await axios.get(`${baseUrl}/api/stores/${currentStoreId}`);
        setStoreData(response.data);
        setPreviewUrl(response.data.imageStore);
      } catch (error) {
        console.error(error, 'Error fetching store data:' );
        setError('Failed to load store data.');
      }
    };
    if (currentStoreId) {
      fetchStoreData();
  }
}, [currentStoreId]);

const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === 'imageStore') {
    setNewImage(files[0]);
    const fileURL = URL.createObjectURL(files[0]);
    setPreviewUrl(fileURL); // Set the preview URL for the selected file
  } else {
    setStoreData({ ...storeData, [name]: value });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  const formData = new FormData();

  // Append existing store data to formData
  Object.keys(storeData).forEach(key => {
    if (key !== 'imageStore') { // Exclude the old imageStore field
      formData.append(key, storeData[key]);
    }
  });

  // Append new image under the 'imageStore' field if present
  if (newImage) {
    formData.append('imageStore', newImage);
  }

    try {
      await axios.put(`${baseUrl}/api/stores/${currentStoreId}`, formData, {
        headers: { 
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setError('');
    } catch (error) {
      console.error('Error updating store:', error);
      setError('Failed to update store.');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div >
      <h1 onClick={toggleFormVisibility} className={styles.toggleButton}>Update Salon</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.success}>Store updated successfully!</p>}
      {isFormVisible && (
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input  className={styles.inputStyle}  type="text"  name="name"  placeholder="Store Name"  value={storeData.name}  onChange={handleChange} />
        <input  className={styles.inputStyle}  type="text"  name="street"  placeholder="Street"  value={storeData.street}  onChange={handleChange}  />
        <input  className={styles.inputStyle}  type="text"  name="city"  placeholder="City"  value={storeData.city}  onChange={handleChange}  require  />
        <input  className={styles.inputStyle}  type="text"  name="state"  placeholder="State"  value={storeData.state}  onChange={handleChange}  />
        <input  className={styles.inputStyle}  type="text"  name="zipCode"  placeholder="Zip Code"  value={storeData.zipCode}  onChange={handleChange} />
        <input  className={styles.inputStyle}  type="text"  name="country"  placeholder="Country"  value={storeData.country}  onChange={handleChange} />
        <input  className={styles.inputStyle}  type="text"  name="phone"  placeholder="Phone"  value={storeData.phone}  onChange={handleChange} />
        <input  className={styles.inputStyle}  type="text"  name="mobile"  placeholder="Mobile"  value={storeData.mobile}  onChange={handleChange} />
        <input  className={styles.inputStyle}  type="text"  name="mobileOne"  placeholder="mobileOne"  value={storeData.mobileOne}  onChange={handleChange} />
        <input  className={styles.inputStyle}  type="email"  name="email"  placeholder="Email"  value={storeData.email}  onChange={handleChange}  required/>
  
        <div className={styles.imageContainer}>
          <label className={styles.label}>
            Store Image
          </label>
          <input
            className={styles.imageInput}
            type="file"
            name="imageStore"
            onChange={handleChange}
          />
          <div className={styles.imagePreviewContainer}>
              {previewUrl && (
                <Image
                src={previewUrl}
                alt="Store Preview"
                width={50} height={50} style={{ width: 'auto', height: 'auto' }}
              />
              )}
            </div>
        </div>
  
        <button
          type="submit"
          className={styles.button}
        >
          Update Store
        </button>
      </form>
      )}
    </div>
  );
  
};

export default UpdateStoreForm;
