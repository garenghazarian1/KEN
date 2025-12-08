// app/stores/page.jsx
"use client";
import Link from "next/link";

import styles from "./PageEight.module.css";
import Image from "next/image";
import ContactContent from "@/components/contact/ContactContent";

// Store data reused from contact page
const stores = [
  {
    _id: "1",
    name: "Ken Beauty Salon, The Galleria Al Maryah Island",
    street: "The Galleria Al Maryah Island - 107 Hamouda Bin Ali Al Dhaheri St",
    city: "Abu Dhabi",
    zipCode: "00000",
    country: "United Arab Emirates",
    phone: "+971 2 621 8802",
    mobile: "+971 50 304 3570",
    email: "info@ken-salon.com",
    imageStore: "/Galleria.jpg",
  },
  {
    _id: "2",
    name: "Ken Beauty Salon & Ken Barbershop, Rixos Hotel",
    street: "Rixos Hotel, Marina - Al Kasir - Al Marina",
    city: "Abu Dhabi",
    zipCode: "00000",
    country: "United Arab Emirates",
    phone: "+971 2 635 9993",
    mobile: "+971 55 557 0029",
    email: "info@ken-salon.com",
    imageStore: "/Rixos.jpg",
  },
];

const PageEight = () => {
  return (
    <>
      <ContactContent stores={stores} />
    </>
  );
};

export default PageEight;
