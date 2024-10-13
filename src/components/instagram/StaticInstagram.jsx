"use client";
import { useEffect } from "react";

const InstagramEmbed = () => {
  useEffect(() => {
    // Inject the Instagram embed script only once
    const script = document.createElement("script");
    script.setAttribute("src", "https://www.instagram.com/embed.js");
    script.setAttribute("async", "true");
    document.body.appendChild(script);

    // Load the embed script to process the embeds
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    // Clean up the script to avoid memory leaks
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="instagram-embed-container">
      <style jsx>{`
        .instagram-embed-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          padding: 20px;
        }
      `}</style>

      {/* Embed for the first Instagram post */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <style>
         .instagram-media {
          max-height: 500px !important;
         }
         .instagram-media iframe {
           margin: auto !important;
         }
         .instagram-media [role='button'],  .instagram-media .InstagramCaption,  {
           display: none !important;
         }
      </style>
            <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/C3c9gsRxDOg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
          `,
        }}
      />

      {/* Embed for the second Instagram post */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DATm09ztoft/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
          `,
        }}
      />

      {/* Embed for the third Instagram post */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DAy8iPyiB0D/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote> 
        `,
        }}
      />

      {/* Embed for the fourth Instagram post */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DA1CZqEyCwm/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
        `,
        }}
      />

      {/* Embed for the fifth Instagram post */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DAiUQm7R_PN/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" ></blockquote>
        `,
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DAh4fqTioXz/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
        `,
        }}
      />
    </div>
  );
};

export default InstagramEmbed;
