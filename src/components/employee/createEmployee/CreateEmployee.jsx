
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { baseUrl } from '@/api/ports';
import styles from "./CreateEmployee.module.css"


const CreateEmployee = () => {
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        storeId: '',
        userId: '',
        sections: '' 
    });
    const [error, setError] = useState('');
    const { data: session } = useSession();
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const fetchStoresAndUsers = async () => {
            try {
                const storesRes = await axios.get(`${baseUrl}/api/stores`);
                const usersRes = await axios.get(`${baseUrl}/api/users?search=${searchTerm}`);
                setStores(storesRes.data);
                setUsers(usersRes.data);
               
            } catch (err) {
                console.error('Failed to fetch stores or users:', err);
            }
               
        };

        fetchStoresAndUsers();
    }, [searchTerm]);
    //console.log("🚀 ~ fetchStoresAndUsers ~ setUsers:", users)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            setError('You must be logged in to create an employee.');
            return;
        }

        const submitData = {
            store: formData.storeId,
            userInfo: formData.userId,
            sections: formData.sections.split(',').map(section => section.trim()), // Process sections
        };

        try {
            await axios.post(`${baseUrl}/api/employees`, submitData, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                },
            });
            alert('Employee created successfully!');
            setFormData({ storeId: '', userId: '', sections: '' }); // Reset form
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create employee');
        }
    };

        // Function to toggle the form visibility
        const toggleFormVisibility = () => {
            setIsFormVisible(!isFormVisible);
        };

        return (
            <>
              <h2 onClick={toggleFormVisibility} className={styles.button}>Create Employee</h2>
              <div className={styles.container}>
              {isFormVisible && (
                <form onSubmit={handleSubmit} className={styles.visibleForm}>
                  <select className={styles.input} name="storeId" value={formData.storeId} onChange={handleChange} required>
                    <option value="">Select a Store</option>
                    {stores.map(store => (
                      <option key={store._id} value={store._id}>{store.name}</option>
                    ))}
                  </select>
        
                  <input className={styles.input} type="text" placeholder="Search Users by Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        
                  <select className={styles.input} name="userId" value={formData.userId} onChange={handleChange} required>
                    <option value="">Select a User</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                  </select>
        
                  <input className={styles.input} type="text" name="sections" placeholder="Sections (comma-separated)" value={formData.sections} onChange={handleChange} required />
        
                  {error && <div className={styles.error}>{error}</div>}
                  <button type="submit" className={styles.button}>Create Employee</button>
                </form>
                
              )}
              </div>
            </>
          );
        };
        
        export default CreateEmployee;
