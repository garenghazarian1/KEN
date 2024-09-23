// components/MyCalendar.jsx
"use client";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";
import { useSession } from 'next-auth/react'; 
import { useStore } from '@/context/StoreContext';
import styles from "./ReactCalender.module.css"

const MyCalendar = () => {
  const { storeHours, storeClosures } = useStore();
  //console.log("🚀 ~ MyCalendar ~ storeClosures:", storeClosures)
  const [value, onChange] = useState(new Date());
  const { data: session } = useSession();
  const isOwner = session?.user?.role === 'owner';

  const minDate = new Date();
  if (!isOwner) {
    minDate.setDate(minDate.getDate() + 1);
  }
  const maxDate = new Date(minDate);
  maxDate.setMonth(maxDate.getMonth() + 1);

  const isStoreOpenOnDate = (date) => {
    const dayName = date.toLocaleString('en-US', { weekday: 'long' });
    return storeHours.some(hour => hour.day === dayName && hour.isOpen);
  };

  const isStoreClosedOnDate = (date) => {
    
    
    return storeClosures.some(closure => {
      if (!closure.closureDate) {
        console.warn("Closure date is undefined or null:", closure);
        return false;
      }
  
      const closureDate = new Date(closure.closureDate);
      if (isNaN(closureDate.getTime())) {
        console.warn("Invalid closure date:", closure.closureDate);
        return false;
      }
  
      // Adjust for time zone offset to compare just the dates
      const adjustedClosureDate = new Date(closureDate.getUTCFullYear(), closureDate.getUTCMonth(), closureDate.getUTCDate());
      const adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
      return adjustedDate.getTime() === adjustedClosureDate.getTime();
    });
  };
  

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      if (isStoreClosedOnDate(date)) {
        return <div style={{ color: 'red' }}>Closed</div>;
      } else if (isStoreOpenOnDate(date)) {
        return <div style={{ color: 'green' }}>Open</div>;
      }
    }
  };

  const tileDisabled = ({ date, view }) => view === 'month' && isStoreClosedOnDate(date);

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        tileContent={tileContent}
        tileDisabled={tileDisabled} 
        className={styles.calendarContainer}
      />
    </div>
  );
};

export default MyCalendar;
