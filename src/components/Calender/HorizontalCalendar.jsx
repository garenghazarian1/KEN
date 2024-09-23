"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useDate } from '@/context/DateContext'; 
import styles from './HorizontalCalendar.module.css';


const HorizontalCalendar = ({ startDate, numberOfDays }) => {
  const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } = useDate();
    
  const days = Array.from({ length: numberOfDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Adjust hours array to include only hours from 10 AM to 10 PM
  const hours = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setHours(10 + i, 0, 0, 0);
    return date;
  });

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when date changes
  };

  const handleTimeClick = (time) => {
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(time.getHours(), time.getMinutes());
    setSelectedTime(selectedDateTime);
  };

  const isSelectedDay = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isSelectedTime = (time) => {
    return selectedTime && time.getHours() === selectedTime.getHours() && time.getMinutes() === selectedTime.getMinutes();
  };

  return (
    <>
      <h2 className={styles.headOne}>Select day and time</h2>
      <div className={styles.container}>
        <p className={styles.text}>select day</p>
        <Swiper
          slidesPerView={6}
          spaceBetween={5}
          pagination={{ clickable: true }}
          className={styles.swiper}
          breakpoints={{
            0: { slidesPerView: 4 },
            768: { slidesPerView: 10 },
            1024: { slidesPerView: 14 },
            1280: { slidesPerView: 16 },
            1536: { slidesPerView: 20 },
          }}
        >
          {days.map((day, index) => (
            <SwiperSlide key={index} onClick={() => handleDateClick(day)}>
              <div className={`${styles.slide} ${isSelectedDay(day) ? styles.selected : ''}`}>
                {formatDate(day)}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <p className={styles.text}>select time</p>
        {selectedDate && (
          <Swiper
            slidesPerView={6}
            spaceBetween={5}
            pagination={{ clickable: true }}
            className={styles.swiper}
            breakpoints={{
              0: { slidesPerView: 4 },
              768: { slidesPerView: 10 },
              1024: { slidesPerView: 14 },
              1280: { slidesPerView: 16 },
              1536: { slidesPerView: 20 },
            }}
          >
            {hours.map((hour, index) => (
              <SwiperSlide key={index} onClick={() => handleTimeClick(hour)}>
                <div className={`${styles.slide} ${isSelectedTime(hour) ? styles.selected : ''}`}>
                  {formatTime(hour)}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default HorizontalCalendar;
