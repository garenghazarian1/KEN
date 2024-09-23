import styles from "./PageNineteen.module.css"
import { bad} from "@/app/ui/fonts"

export default function PageNineteen() {
  return (
    <>
    <div className={styles.container}>
        <div className={styles.sectionA}>
        <video src="/portfolio/description04.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
        </div>
        <div className={styles.sectionB}>
        <div className={styles.content}>
            <h2 className={styles.num}>01</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Hair Styling:</h3>
            <p className={styles.text}>Let our expert stylists work their magic, crafting timeless blowouts and intricate updos perfect for any occasion, whether it&apos;s a star-studded event or a cherished celebration. Trust in our signature haircuts, tailored to your unique style and personality, with precision cuts that have adorned the locks of celebrities, ensuring you leave with a head-turning, glamorous look</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>02</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Hair Coloring:</h3>
            <p className={styles.text}>Immerse yourself in the artistry of our color specialists, masters in creating natural-looking highlights and breathtaking balayage. From daring fashion hues to subtle enhancements, our team excels at delivering bespoke color solutions that enhance your features and embrace your individuality. Join the ranks of celebrities who rely on us to keep their hair color vibrant and fashion-forward.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>03</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Hair Treatments:</h3>
            <p className={styles.text}>Treat yourself to indulgent hair treatments designed to replenish and rejuvenate your locks. From lavish deep conditioning sessions to smoothing keratin treatments, our offerings cater to your every need. Nourish your scalp with our specialized treatments, beloved by celebrities for their ability to promote healthy hair growth and elevate overall hair vitality.</p>
        </div>

        <div className={styles.content}>
            <h2 className={styles.num}>04</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Hair Extensions:</h3>
            <p className={styles.text}>Elevate your style with our premium hair extension services, adored by our clientele for their seamless blend and natural finish. Whether it&apos;s length or volume you desire, our extensions will take your look to celebrity status. Explore the versatility of our extension methods, trusted by stars for their durability and comfort.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>05</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Bridal Hairstyles:</h3>
            <p className={styles.text}>Ensure your special day is unforgettable with a bridal hairstyle that enhances your natural beauty. From sophisticated updos to romantic waves, we&apos;ll craft a look that perfectly complements your bridal ensemble.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>06</h2>
            <h3 className={`${styles.header} ${bad.className}`}> Hair Curling and Straightening:</h3>
            <p className={styles.text}>Find the perfect balance of sleekness or bounce with our professional hair curling and straightening services. Our expert techniques guarantee lasting results, leaving your hair effortlessly chic.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>07</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Makeup Services:</h3>
            <p className={styles.text}>Unveil camera-ready looks with our professional makeup services. Our skilled artists specialize in creating natural and glamorous styles that have graced celebrity faces. Let our magic enhance your features, delivering a flawless finish just like the A-listers who trust us for their on-screen and off-screen appearances.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>08</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Nail Care:</h3>
            <p className={styles.text}>Indulge in luxurious nail care, pampering your hands and feet with impeccable finishes and meticulous attention. Whether it&apos;s a classic manicure or trendy nail art, our expert technicians will leave you feeling polished and glamorous.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>09</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Solarium:</h3>
            <p className={styles.text}>Embrace a sun-kissed glow with our solarium services, offering a safe and effortless way to achieve a bronzed complexion without harmful UV exposure. Experience the radiant beauty loved by your favorite stars.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>10</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Eyebrows Styling:</h3>
            <p className={styles.text}>Frame your face with perfectly groomed eyebrows tailored to your unique features and preferences. Whether you seek a natural shape or bold arches, our skilled technicians will sculpt and shape your brows to perfection.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>11</h2>
            <h3 className={`${styles.header} ${bad.className}`}>Facials:</h3>
            <p className={styles.text}>Renew your skin with customized facials targeting your specific skincare needs. From hydrating treatments to deep-cleansing masks, our facials leave your skin glowing. refreshed, and revitalized.</p>
        </div>
        <div className={styles.content}>
            <h2 className={styles.num}>12</h2>
            <h3 className={`${styles.header} ${bad.className}`}>VIP Room:</h3>
            <p className={styles.text}>Elevate your salon experience in our exclusive VIP room, where luxury awaits. Relax and unwind in lavish surroundings while receiving personalized service and attention from our expert team, ensuring a truly VIP experience from start to finish.</p>
        </div>
        </div>
    </div>
    </>
  )
}
