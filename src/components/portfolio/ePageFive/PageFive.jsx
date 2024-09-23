"use client"
import Image from "next/image";
import styles from "./PageFive.module.css";
import {bad} from "@/app/ui/fonts"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import { EffectFlip, Pagination } from 'swiper/modules';

export default function PageFive() {

  return (
    <>
     {/* PAGE05  */}
    <div className={styles.containerE}>
        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
          <Swiper
            effect="flip"
            grabCursor={true}
            flipEffect={{ slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[EffectFlip, Pagination]}
            className={styles.swiper}
          >
            <SwiperSlide>
              <Image src="/portfolio/portfolioA001.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
            </SwiperSlide>
            <SwiperSlide>
              <Image src="/portfolio/portfolioA002.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
            </SwiperSlide>
            <SwiperSlide>
              <Image src="/portfolio/portfolioA003.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
            </SwiperSlide>
          </Swiper>
          </div>
          <div className={styles.rightPaneE}>
            <p className={`${styles.textE} ${bad.className}`}>Nestled within the vibrant heart of the UAE, Ken Salon stands as an ethereal oasis where beauty is elevated to an art form.</p>
          </div>
        </div>



        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
          <p className={`${styles.textE} ${bad.className}`}>As you step through the doors, a world of luxury and tranquility unfolds, enveloping you in an atmosphere that whispers of indulgence and rejuvenation.</p>
          </div>
          <div className={styles.rightPaneE}>
          <Swiper
            effect="flip"
            grabCursor={true}
            flipEffect={{ slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[EffectFlip, Pagination]}
            className={styles.swiper}
          >
            <SwiperSlide>
          <Image src="/portfolio/portfolioB001.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioB002.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioB003.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          </Swiper>
          </div>
          
        </div>



        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
          <Swiper
            effect="flip"
            grabCursor={true}
            flipEffect={{ slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[EffectFlip, Pagination]}
            className={styles.swiper}
          >
            <SwiperSlide>
          <Image src="/portfolio/portfolioC001.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioC002.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioC003.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioC004.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          </Swiper>
          </div>
          <div className={styles.rightPaneE}>
          <p className={`${styles.textE} ${bad.className}`}>Founded by the visionary Vicken Ghazarian, whose passion for hair and beauty transcends mere expertise, this sanctuary beckons those who seek to embrace their inner radiance and outer allure. </p>
          </div>
        </div>

        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
          <p className={`${styles.textE} ${bad.className}`}>With two premier locations in Abu Dhabi, Ken Salon offers an exclusive VIP experience where every moment is tailored to your unique desires.</p>
          </div>
          <div className={styles.rightPaneE}>
          <Swiper
            effect="flip"
            grabCursor={true}
            flipEffect={{ slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[EffectFlip, Pagination]}
            className={styles.swiper}
          >
            <SwiperSlide>
          <Image src="/portfolio/portfolioD001.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioD002.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          </Swiper>
          </div>
        </div>
    </div>
    </>
  );
}
