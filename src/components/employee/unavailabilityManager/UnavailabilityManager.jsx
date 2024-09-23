"use client"
import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext'; 
import styles from "./UnavailabilityManager.module.css"

const UnavailabilityManager = () => {
  const { unavailabilities, addUnavailability, updateUnavailability, deleteUnavailability, selectedEmployeeId
  } = useEmployee();
  const [editingUnavailability, setEditingUnavailability] = useState(null);
  const [type, setType] = useState('');
  const [reason, setReason] = useState('');
  const [dates, setDates] = useState('');

  useEffect(() => {
    if (editingUnavailability) {
      setType(editingUnavailability.type);
      setReason(editingUnavailability.reason);
      setDates(editingUnavailability.unavailableDates.join(', '));
    } else {
      resetForm();
    }
  }, [editingUnavailability]);

  const resetForm = () => {
    setType('');
    setReason('');
    setDates('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unavailabilityDetails = {
      type,
      reason,
      unavailableDates: dates.split(',').map(date => new Date(date.trim())),
    };

    if (editingUnavailability) {
      await updateUnavailability(editingUnavailability._id, unavailabilityDetails);
    } else {
      await addUnavailability(unavailabilityDetails);
    }
    setEditingUnavailability(null);
    resetForm();
  };

  const handleEdit = (unavailability) => {
    setEditingUnavailability(unavailability);
  };

  const handleDelete = async (unavailabilityId) => {
    await deleteUnavailability(unavailabilityId);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Type:
            <select className={styles.input} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="vacation">Vacation</option>
              <option value="illness">Illness</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Reason:
            <input className={styles.input} type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Dates (comma-separated):
            <input className={styles.input} type="date" value={dates} onChange={(e) => setDates(e.target.value)} />
          </label>
        </div>
        <button className={styles.button} type="submit">Save</button>
        {editingUnavailability && <button className={styles.button} type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {unavailabilities.map((unavailability) => (
          <div key={unavailability._id} className={styles.unavailabilityCard}>
            <div className={styles.cardTitle}>Type: {unavailability.type}</div>
            <div className={styles.cardText}>Reason: {unavailability.reason}</div>
            <div className={styles.cardDates}>Dates: {unavailability.unavailableDates.join(', ')}</div>
            <div className={styles.actionButtons}>
              <button 
                onClick={() => handleEdit(unavailability)}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(unavailability._id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnavailabilityManager;
