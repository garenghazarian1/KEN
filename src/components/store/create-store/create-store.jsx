// pages/create-store.js
"use client"
import { useState } from 'react';
import axios from 'axios';
import {baseUrl} from "@/api/ports";
import { useSession, signIn } from 'next-auth/react';
import styles from './CreateStore.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const CreateStore = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', street: '', city: '', state: '', zipCode: '', country: '', phone: '', mobile: '', mobileOne:'', email: '', image: null,});
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file) {
        setImagePreviewUrl(URL.createObjectURL(file));
      }
      setFormData({ ...formData, image: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'loading') {return;}
    if (status === 'unauthenticated') {signIn();return;}

    const data = new FormData();
    data.append('name', formData.name);
    data.append('street', formData.street);
    data.append('city', formData.city);
    data.append('state', formData.state);
    data.append('zipCode', formData.zipCode);
    data.append('country', formData.country);
    data.append('phone', formData.phone);
    data.append('mobile', formData.mobile);
    data.append('mobileOne', formData.mobileOne);
    data.append('email', formData.email);
    if (formData.image) data.append('imageStore', formData.image);
   
    try {
        const response = await axios.post(`${baseUrl}/api/stores`, data, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      console.log('Store created:', response.data);
      router.push("/stores")

    } catch (error) {
      console.error(error.response?.data?.message || error.message, 'Error creating store:' );
      const errorText = error.response?.data?.message || error.message;
    setErrorMessage(`Error creating store: ${errorText}`);
    console.error(errorText);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
    <h1 className={styles.toggleButton} onClick={toggleFormVisibility}>Create Salon</h1>
    {isFormVisible && (
        <>
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <input className={styles.inputStyle} type="text" name="name" placeholder="Store Name" value={formData.name} onChange={handleChange} required  />
      <input className={styles.inputStyle} type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} required  />
      <input className={styles.inputStyle} type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required  />
      <input className={styles.inputStyle} type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange}  />
      <input className={styles.inputStyle} type="text" name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange}  />
      <input className={styles.inputStyle} type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange}  />
      <input className={styles.inputStyle} type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange}  />
      <input className={styles.inputStyle} type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} />
      <input className={styles.inputStyle} type="text" name="mobileOne" placeholder="mobileOne" value={formData.mobileOne} onChange={handleChange} />
      <input className={styles.inputStyle} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required  />
      {/* Display Error Message */}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {/* Image Preview */}
      {imagePreviewUrl && <Image  src={imagePreviewUrl} alt="Preview" width={250} height={250} className={styles.imagePreview} />}
      <input  type="file" name="image" onChange={handleChange} className={styles.fileInput} />
      <button type="submit" className={styles.button}>Create Store</button>
    </form>
    
    </>
    )}
    
    </>
  );
};

export default CreateStore;
