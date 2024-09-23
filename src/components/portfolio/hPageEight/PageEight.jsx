// app/stores/page.jsx
"use client"
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import styles from './PageEight.module.css';
import Image from 'next/image';

const PageEight = () => {
  const { stores, error } = useStore();
  
  if (error) return <p className={styles.error}>{error}</p>;
  

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}><span className={styles.span}>Visit</span> our salons</h1>
      
      <div className={styles.storeList}>
        {stores.map((store) => (
          <div key={store._id} className={styles.storeCard}>
            <Link href={`/stores/${store._id}`} passHref>
              <h2 className="text-xl font-semibold text-center">{store.name}</h2>
            
            {store.imageStore && (
              <div className={styles.storeImage}>
                <Image className={styles.storeImage} src={store.imageStore} alt="Store" width={500} height={500} priority />
              </div>
            )}
             
            </Link>
            {/* Displaying address fields */}
            {store && (
              <div className={styles.storeDetails}>
                <p>{store.street}</p>
                <p>{store.city}, {store.state} {store.zipCode}</p>
                <p>{store.country}</p>
              </div>
            )}
            {/* Displaying contact info fields */}
            {store && (
              <div className={styles.storeContacts}>
                <p >Phone: {store.phone}</p>
                <p>
                  Mobile: <a href={`https://wa.me/${store.mobile}?text=Hello, I'm interested in your services.`} className={styles.contactLink} target="_blank" rel="noopener noreferrer">{store.mobile}</a>
                </p>
                <p>
                  Barber Mobile: <a href={`https://wa.me/${store.mobileOne}?text=Hello, I'm interested in your services.`} className={styles.contactLink} target="_blank" rel="noopener noreferrer">{store.mobileOne}</a>
                </p>
                <p>Email: <a href={`mailto:${store.email}`} className={styles.contactLink}>{store.email}</a></p>
                
              </div>
              
            )}

          </div>
          
        ))}
      </div>
      
    </div>
  );
};


export default PageEight;
