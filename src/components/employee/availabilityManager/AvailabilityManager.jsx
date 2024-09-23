"use client";
import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from "./AvailabilityManager.module.css"

const inputStyle = "text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";
const button = " flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg  transition duration-300 ease-in-out   hover:bg-gray-400"



const AvailabilityManager = () => {
    const { availabilities, addAvailability, updateAvailability, deleteAvailability,selectedEmployeeId, error, } = useEmployee();
    const [newAvailability, setNewAvailability] = useState({ dates: [], startTime: '', endTime: '' });
    const [editingAvailabilityId, setEditingAvailabilityId] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');

    const filteredAvailabilities = availabilities.filter(availability => availability.employee?._id === selectedEmployeeId);

    const handleAddAvailabilitySubmit = async (e) => {
        e.preventDefault();
        const availabilityData = { ...newAvailability, day: selectedDay }; // Include selectedDay in the payload
        await addAvailability(availabilityData);
        setNewAvailability({ dates: [], startTime: '', endTime: '' }); // Reset form
        setSelectedDay(''); // Reset selected day
    };
    
    const handleUpdateAvailabilitySubmit = async (e) => {
        e.preventDefault();
        if (editingAvailabilityId) {
            const availabilityData = { ...newAvailability, day: selectedDay }; // Include selectedDay in the payload
            await updateAvailability(editingAvailabilityId, availabilityData);
            setEditingAvailabilityId(null);
            setNewAvailability({ dates: [], startTime: '', endTime: '' }); // Reset form
            setSelectedDay(''); // Reset selected day
        }
    };
    
    const handleEditClick = (availability) => {
        setEditingAvailabilityId(availability._id);
        setNewAvailability({ dates: availability.dates, startTime: availability.startTime, endTime: availability.endTime });
        setSelectedDay(availability.day); // Set the day for editing
    };
    

    const handleDeleteClick = async (availabilityId) => {
        await deleteAvailability(availabilityId);
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Availabilities</h3>
            <ul className={styles.list}>
                {filteredAvailabilities.map((availability) => (
                    <li key={availability._id} className={styles.listItem}>
                        <p className={styles.itemText}>
                            <span >Days:</span> {availability.day}
                        </p>
                        <p className={styles.itemText}>
                            <span >Time:</span> {availability.startTime} - {availability.endTime}
                        </p>

                        <div className={styles.buttonContainer}>
                            <button className={styles.button} onClick={() => handleEditClick(availability)}>Edit</button>
                            <button className={styles.button} onClick={() => handleDeleteClick(availability._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <h4 className={styles.formHeading}>{editingAvailabilityId ? 'Edit Availability' : 'Add Availability'}</h4>
            <form onSubmit={editingAvailabilityId ? handleUpdateAvailabilitySubmit : handleAddAvailabilitySubmit} className={styles.form}>
                <div className={styles.formControl}>
                <div>    
                    <select
                        id="day"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Select a day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                        
                    </select>
                </div>

                <div >
                    <ReactDatePicker
                        placeholderText="Start Time"
                        selected={newAvailability.startTime ? new Date(new Date().toDateString() + ' ' + newAvailability.startTime) : null}
                        onChange={date => setNewAvailability({ ...newAvailability, startTime: date.toTimeString().substring(0, 5) })}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Start Time"
                        dateFormat="HH:mm"
                        className={styles.datePicker}
                    />
                </div>

                <div className="time-picker-wrapper">
                    <ReactDatePicker
                        placeholderText="End Time"
                        selected={newAvailability.endTime ? new Date(new Date().toDateString() + ' ' + newAvailability.endTime) : null}
                        onChange={date => setNewAvailability({ ...newAvailability, endTime: date.toTimeString().substring(0, 5) })}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="End Time"
                        dateFormat="HH:mm"
                        className={styles.datePicker}
                    />
                </div>

            </div>

                <button type="submit"  className={` ${styles.submitButton}`}>{editingAvailabilityId ? 'Update' : 'Add'}</button>

                {editingAvailabilityId && <button type="button" className={`${styles.cancelButton}`} onClick={() => setEditingAvailabilityId(null)}>Cancel Edit</button>}
            </form>
        </div>
    );
    
};

export default AvailabilityManager;
