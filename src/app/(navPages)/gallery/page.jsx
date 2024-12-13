// pages/Gallery.js
import Head from "next/head";
import InstagramFeed from "@/components/instagram/InstagramFeed";
import styles from "./Gallery.module.css";
import InstagramEmbed from "@/components/instagram/StaticInstagram";

export default function Gallery() {
  return (
    <>
      <Head>
        <title>Gallery | Our Site</title>
        <meta
          name="description"
          content="Explore our curated gallery featuring Instagram content."
        />
        {/* <script
          src="https://cdn.lightwidget.com/widgets/lightwidget.js"
          async
        ></script> */}
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Our Gallery</h1>

        {/* Static Instagram Posts Section */}
        <section className={styles.instagramStaticPosts}>
          {/* <h2>Instagram Highlights</h2> */}
          <div className={styles.staticPostsGrid}>
            {/* Instagram Post 1 */}
            <InstagramEmbed />

            {/* Add more InstagramEmbed components for additional posts */}
          </div>
        </section>
        {/* <section>
          <InstagramFeed />
        </section> */}
      </main>
    </>
  );
}
