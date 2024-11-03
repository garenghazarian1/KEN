"use client";
import { useEffect } from "react";

const instagramLinks = [
  "https://www.instagram.com/reel/DB1BE3UttXT/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DBHmaFdCGkf/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DBjvVYpBsCZ/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DBes7pNCy9Q/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DBZdZ1IC_Aa/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DBWc41MSDJu/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DBT--MQSRWY/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DBLSZ1USWI7/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/C3c9gsRxDOg/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DATm09ztoft/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DAy8iPyiB0D/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DA1CZqEyCwm/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DAiUQm7R_PN/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DAh4fqTioXz/?utm_source=ig_embed&amp;utm_campaign=loading",
];

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
          background-color: var(--teal-950);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: background-color 0.3s ease;
        }

        .instagram-embed-container:hover {
          background-color: var(--teal-800);
        }

        .instagram-embed-container::-webkit-scrollbar {
          width: 10px;
        }

        .instagram-embed-container::-webkit-scrollbar-thumb {
          background-color: var(--light-gray);
          border-radius: 10px;
        }
      `}</style>

      {instagramLinks.map((link, index) => (
        <div
          key={index}
          dangerouslySetInnerHTML={{
            __html: `
              <style>
                .instagram-media {
                  max-height: 500px !important;
                }
                .instagram-media iframe {
                  margin: auto !important;
                }
                .instagram-media [role='button'], .instagram-media header, .instagram-media .InstagramCaption {
                  display: none !important;
                }
              </style>
              <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${link}" data-instgrm-version="14"></blockquote>
            `,
          }}
        />
      ))}
    </div>
  );
};

export default InstagramEmbed;
