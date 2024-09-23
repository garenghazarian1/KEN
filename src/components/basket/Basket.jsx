
import styles from './Basket.module.css'; 

const Basket = ({ selectedServices, services, onRemoveService }) => {
    if (selectedServices.size === 0) {
        return <div className={styles.container + " " + styles.empty}>Your basket is empty.</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Your Selected Services</h2>
            <div className="flex flex-col flex-wrap">
                {Array.from(selectedServices).map(serviceId => {
                    const service = services.find(s => s._id === serviceId);
                    return (
                        <div key={serviceId} className={styles.item}>
                            <span className={styles.itemPrice}>{service.title} - AED {service.price}</span>
                            <button onClick={() => onRemoveService(serviceId)} className={styles.removeButton}>
                                Remove
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Basket;
