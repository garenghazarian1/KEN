// pages/Gallery.js
import Head from "next/head";
import InstagramFeed from "@/components/instagram/InstagramFeed";
import styles from "./Gallery.module.css";

export default function Gallery() {
  return (
    <>
      <Head>
        <title>Gallery | Our Site</title>
        <meta
          name="description"
          content="Explore our curated gallery featuring Instagram content."
        />
        <script
          src="https://cdn.lightwidget.com/widgets/lightwidget.js"
          async
        ></script>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Our Gallery</h1>
        <section>
          <InstagramFeed />
        </section>
      </main>
    </>
  );
}
