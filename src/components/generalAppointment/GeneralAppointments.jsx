"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { baseUrl } from '@/api/ports';
import { useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from "./GeneralAppointments.module.css";

export default function GeneralAppointments() {
    const { data: session, status } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [groupedAppointments, setGroupedAppointments] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAppointments = async () => {
            if (status === "authenticated") {
                if (session.user.role === "owner") {
                    try {
                        const response = await axios.get(`${baseUrl}/api/appointments/allAppointments/`, {
                            headers: {
                                Authorization: `Bearer ${session.accessToken}`
                            }
                        });
                        const appointments = response.data.allAppointments;
                        setAppointments(appointments);
                        groupAppointmentsByDate(appointments);
                    } catch (err) {
                        setError(err.response ? err.response.data.message : err.message);
                    }
                } else {
                    router.push('/');
                }
            }
        };

        const groupAppointmentsByDate = (appointments) => {
            const grouped = appointments.reduce((acc, appointment) => {
                const date = new Date(appointment.date).toLocaleDateString();
                const employee = appointment.employee.userInfo.name;
                if (!acc[date]) acc[date] = {};
                if (!acc[date][employee]) acc[date][employee] = [];
                acc[date][employee].push(appointment);
                return acc;
            }, {});
            setGroupedAppointments(grouped);
        };

        fetchAppointments();
    }, [status, session]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedEmployee(null); // Reset selected employee on date change
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const selectedDateKey = selectedDate.toLocaleDateString();
    const employeesForSelectedDate = groupedAppointments[selectedDateKey] ? Object.keys(groupedAppointments[selectedDateKey]) : [];
    const appointmentsForSelectedDateAndEmployee = selectedEmployee ? groupedAppointments[selectedDateKey][selectedEmployee] : [];

    const calculateTotalPrice = (services) => {
        return services.reduce((total, service) => total + service.price, 0);
    };

    const calculatePriceWithVAT = (price) => {
        return price * 1.05;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Appointments</h1>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className={styles.calendar}
            />
            <h2 className={styles.subHeader}>Appointments for {selectedDate.toLocaleDateString()}</h2>
            {employeesForSelectedDate.length > 0 ? (
                <div className={styles.employeeList}>
                    {employeesForSelectedDate.map(employee => (
                        <div
                            key={employee}
                            className={`${styles.employeeItem} ${selectedEmployee === employee ? styles.selectedEmployee : ''}`}
                            onClick={() => setSelectedEmployee(employee)}
                        >
                            {employee}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No appointments for this date.</p>
            )}
            {selectedEmployee && (
                <ul className={styles.appointmentList}>
                    {appointmentsForSelectedDateAndEmployee.map((appointment) => {
                        const totalPrice = calculateTotalPrice(appointment.services);
                        const totalPriceWithVAT = calculatePriceWithVAT(totalPrice);
                        return (
                            <li key={appointment._id} className={styles.appointmentItem}>
                                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                                <p><strong>Employee:</strong> {appointment.employee.userInfo.name}</p>
                                <p><strong>User:</strong> {appointment.user.name}</p>
                                <p><strong>Phone:</strong> {appointment.user.phoneNumber}</p>
                                
                                <p><strong>Start Time:</strong> {appointment.startTime}</p>
                                <p><strong>End Time:</strong> {appointment.endTime}</p>
                                <p><strong>Comment:</strong> {appointment.comment}</p>
                                <p><strong>Total Price:</strong> {totalPrice} AED</p>
                                <p><strong>Total Price (with VAT):</strong> {totalPriceWithVAT.toFixed(2)} AED</p>
                                <p><strong>Services:</strong></p>
                                <ul className={styles.serviceList}>
                                    {appointment.services.map(service => (
                                        <li key={service._id}>
                                            <p className={styles.serviceDetails}><strong>Section:</strong> {service.section}</p>
                                            <p className={styles.serviceDetails}><strong>Category:</strong> {service.category}</p>
                                            <p className={styles.serviceDetails}><strong>Title:</strong> {service.title}</p>
                                            <p className={styles.serviceDetails}><strong>Price:</strong> {service.price} AED</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
