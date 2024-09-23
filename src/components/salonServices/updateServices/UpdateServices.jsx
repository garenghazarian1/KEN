"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useSession } from 'next-auth/react';
import { useService } from '@/context/ServiceContext';
import styles from "./UpdateServices.module.css"

const UpdateServicePage = () => {
  const [serviceData, setServiceData] = useState({ title: '', description: '', duration: 0, price: 0, category: '', section: '', isActive: true });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { currentServiceId } = useService();

  useEffect(() => {
    if (currentServiceId) {
      const fetchServiceDetails = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/services/${currentServiceId}`);
          setServiceData(response.data);
          setIsFormVisible(true);
        } catch (error) {
          console.error(error);
          setError('Failed to load service details.');
        }
      };

      fetchServiceDetails();
    }
  }, [currentServiceId]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    
  if (!currentServiceId) {
    console.error("Service ID is undefined.");
    setError("Service ID is missing.");
    setIsLoading(false);
    return;
  }

    try {
      await axios.put(`${baseUrl}/api/services/${currentServiceId}`, serviceData, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      alert('Service updated successfully');
      router.push(`/stores`);
    } catch (error) {
      console.error(error);
      setError('Failed to update service.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <p className={styles.error}>{error}</p>;

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
  <>
    <h2 onClick={toggleFormVisibility} className={styles.toggleButton}>Update Service</h2>
    
    {isFormVisible && (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
       <input className={styles.inputStyle} id="section" name="section" type="text" placeholder="Section" value={serviceData.section} onChange={handleChange} required />
          <input className={styles.inputStyle} id="title" name="title" type="text" placeholder="Title" value={serviceData.title} onChange={handleChange} required />
          <textarea className={styles.inputStyle} id="description" name="description" placeholder="Description" value={serviceData.description} onChange={handleChange} />
          <input className={styles.inputStyle} id="duration" name="duration" type="number" placeholder="Duration (in minutes)" value={serviceData.duration} onChange={handleChange} required />
          <input className={styles.inputStyle} id="price" name="price" type="number" placeholder="Price" value={serviceData.price} onChange={handleChange} required />
          <input className={styles.inputStyle} id="category" name="category" type="text" placeholder="Category" value={serviceData.category} onChange={handleChange} required />
        <div className="flex items-center">
          <label htmlFor="isActive" className={styles.label}>Active</label>
          <input className={styles.inputStyle} id="isActive" name="isActive" type="checkbox" checked={serviceData.isActive} onChange={handleChange} />
        </div>

  <button type="submit" disabled={isLoading} className={styles.button}>
    {isLoading ? 'Updating...' : 'Update Service'}
  </button>
  {error && <p className={styles.error}>{error}</p>}
</form>
 )}


    </>
  );
};

export default UpdateServicePage;
