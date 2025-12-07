"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import styles from "./InstagramEmbed.module.css";

// Instagram post/reel IDs - add your Instagram post IDs here
const INSTAGRAM_POSTS = [
  "DG5apNNvZC-", // Add more post IDs as needed
];

export default function InstagramEmbed() {
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && scriptLoaded && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [mounted, scriptLoaded]);

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading Instagram posts...</div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className={styles.container}>
        {INSTAGRAM_POSTS.map((postId) => (
          <blockquote
            key={postId}
            className="instagram-media"
            data-instgrm-permalink={`https://www.instagram.com/reel/${postId}/`}
            data-instgrm-version="14"
          />
        ))}
      </div>
    </>
  );
}
