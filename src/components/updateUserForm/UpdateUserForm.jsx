import { useState, useEffect } from 'react';
import styles from './UpdateUserForm.module.css';
import { baseUrl } from '@/api/ports';

const UpdateUserForm = ({ session }) => {
    useEffect(() => {
        //console.log("Session Object: ", session);
    }, [session]);

    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phoneNumber: session?.user?.phoneNumber || '',
        dateOfBirth: session?.user?.dateOfBirth ? new Date(session.user.dateOfBirth).toISOString().substring(0, 10) : '',
        street: session?.user?.street || '',
        city: session?.user?.city || '',
        state: session?.user?.state || '',
        zipCode: session?.user?.zipCode || '',
        password: '',
        image: null,
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        setIsUpdating(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const res = await fetch(`${baseUrl}/api/users/update/${session.user._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                },
                body: formDataToSend
            });
            const data = await res.json();
            if (res.ok) {
                alert('Profile updated successfully!');
                // Optionally, refresh the session to reflect changes
            } else {
                alert(`Failed to update profile: ${data.message}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className={styles.updateForm}>
            <h2 className={styles.updateFormH2}>Update Profile</h2>
            <div className={styles.formFlex}> 
            <div>
            <label className={styles.updateFormLabel}>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                    <label className={styles.updateFormLabel}>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled />
                    </div>
                <div>
            <label className={styles.updateFormLabel}>Phone Number:</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                </div>
                <div>
            <label className={styles.updateFormLabel}>Date of Birth:</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
                </div>
                <div>
            <label className={styles.updateFormLabel}>Street:</label>
                <input type="text" name="street" value={formData.street} onChange={handleInputChange} />
                </div>
                <div>
            <label className={styles.updateFormLabel}>City:</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
                </div>
                <div>
            <label className={styles.updateFormLabel}>State:</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} />
                </div>
                <div>
            <label className={styles.updateFormLabel}>Zip Code:</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                </div>
                <div>
                    <label className={styles.updateFormLabel}>Password (New or Update):</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
                </div>
                <div>
            <label className={styles.updateFormLabel}>Profile Image:</label>
                <input type="file" name="image" onChange={handleFileChange} />
                </div>
                </div>
            <button type="submit" disabled={isUpdating} className={styles.button}>
                {isUpdating ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    );
};

export default UpdateUserForm;