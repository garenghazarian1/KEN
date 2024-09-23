
import { useEffect, useState } from 'react';
import styles from './UserCard.module.css';
import { useAppointment } from '@/context/AppointmentContext'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation';  
import LoadingSkeleton from '../loading/LoadingSkeleton';
import Link from 'next/link';
import UpdateUserForm from '../updateUserForm/UpdateUserForm';



const UserCard = ({ session }) => {
    const { appointments, fetchUserAppointments, deleteAppointment, isLoading } = useAppointment();
    const router = useRouter();

    useEffect(() => {
    
        if (session?.user) {
            fetchUserAppointments(); 
        }
    }, [session, fetchUserAppointments]);

    useEffect(() => {
        if (!session) {
            router.push('/');
        } 
    }, [session, router]);

    if (isLoading) return <LoadingSkeleton />;

    const handleDelete = (appointmentId) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            deleteAppointment(appointmentId);
        }
    };

        // Function to sort appointments from latest to earliest
        const sortAppointmentsByDate = (appointments) => {
            return appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        };
    
        const sortedAppointments = sortAppointmentsByDate(appointments);

    return (
        <div className={styles.card}>
            <div className={styles.userInfoFlex}>
                <Image 
                    src={session?.user?.image } 
                    alt={session?.user?.name || "userName" } 
                    width={100} 
                    height={100} 
                    className={styles.userImage}
                />
            <div >
                <h3 className={styles.userName}>Welcome, {session?.user?.name}</h3>
                {/* <p className={styles.userP}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium voluptate velit ullam veritatis adipisci amet ratione, quam explicabo incidunt iusto est nisi, iure voluptatem eveniet magnam! Aliquid ad eos iste.</p> */}
                <div className={styles.goldLine}></div>
                {session?.user?.role === 'employee' && (
                    <Link href="/employee" className={styles.employeeLink}>
                        Employee Dashboard
                    </Link>
                )}
                {session?.user?.role === 'owner' && (
                    <Link href="/generalAppointmentControl" className={styles.employeeLink}>
                        General Appointment Control
                    </Link>
                )}
            </div>
           
                </div>
                
                <h2 className={styles.userName}>Your Appointments</h2>
                <ul className={styles.appointmentList}>  
                    {sortedAppointments.length > 0 ? (
                        sortedAppointments.map((appt, index) => (
                            <li key={index} className={styles.appointmentItem}>
                                <div className={styles.dateFlex}>
                               <p className={styles.date}> Date: {appt.date}</p> 
                               <p className={styles.date}> Time: {appt.startTime} - {appt.endTime} </p>
                               </div>
                               <div className={styles.goldLine1}></div>
                               <p> Employee: {appt.employee ? appt?.employee?.userInfo?.name : 'No Employee Assigned'} </p>
                               <div className={styles.goldLine1}></div>
                               <p>
                                    Services:
                                    <br />
                                        {appt.services.map((service, index) => (
                                    <span key={index}>
                                        {service.title}: {service.price} AED.
                                    <br />
                                    </span>
                                    ))}
                                </p>
                                <button onClick={() => handleDelete(appt._id)} className={styles.deleteButton}>
                                    Delete
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>No appointments available.</li>
                    )}
                </ul>
                <UpdateUserForm session={session} />
            
        </div>
    );
};

export default UserCard;
