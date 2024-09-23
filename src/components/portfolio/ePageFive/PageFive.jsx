"use client";
import Image from "next/image";
import styles from "./PageFive.module.css";
import { bad } from "@/app/ui/fonts";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import { EffectFlip, Pagination } from "swiper/modules";

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
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124498/portfolioA003_zypcjn.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124497/portfolioA002_y3rsjh.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124497/portfolioA001_japva9.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className={styles.rightPaneE}>
            <p className={`${styles.textE} ${bad.className}`}>
              Nestled within the vibrant heart of the UAE, Ken Salon stands as
              an ethereal oasis where beauty is elevated to an art form.
            </p>
          </div>
        </div>

        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
            <p className={`${styles.textE} ${bad.className}`}>
              As you step through the doors, a world of luxury and tranquility
              unfolds, enveloping you in an atmosphere that whispers of
              indulgence and rejuvenation.
            </p>
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
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124605/portfolioB003_jzpclw.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124603/portfolioB002_prqz0y.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124603/portfolioB001_amyngl.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
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
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124684/portfolioC004_a2ftgz.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124682/portfolioC003_a0vsxy.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124682/portfolioC002_kcae4b.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124681/portfolioC001_onwwgb.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className={styles.rightPaneE}>
            <p className={`${styles.textE} ${bad.className}`}>
              Founded by the visionary Vicken Ghazarian, whose passion for hair
              and beauty transcends mere expertise, this sanctuary beckons those
              who seek to embrace their inner radiance and outer allure.{" "}
            </p>
          </div>
        </div>

        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
            <p className={`${styles.textE} ${bad.className}`}>
              With two premier locations in Abu Dhabi, Ken Salon offers an
              exclusive VIP experience where every moment is tailored to your
              unique desires.
            </p>
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
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124755/portfolioD002_seqqa8.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="https://res.cloudinary.com/dzzm7ye56/image/upload/v1727124754/portfolioD001_sr0xue.jpg"
                  alt="K Logo"
                  className={styles.rightLeftImagesPageE}
                  width={300}
                  height={300}
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}
