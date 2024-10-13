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
        .Header {
          display: none !important;
        }
        .instagram-media {
          flex: 1 1 300px; /* Each embed will take up minimum 300px of space */
          margin: 0 10px;
          box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5),
            0 1px 10px 0 rgba(0, 0, 0, 0.15);
          border-radius: 3px;
          // max-width: 100%; /* Make sure the embeds are responsive */
          min-width: 300px; /* Minimum width for the embeds */
          max-height: 500px !important;
        }

        /* For mobile screens */
        @media (max-width: 600px) {
          .instagram-media {
            width: 100% !important; /* Take full width on mobile */
            margin: 0 !important; /* Remove extra margins on mobile */
          }
        }

        /* Keep only the video and hide everything else */
        .instagram-media iframe {
          margin: auto !important;
          max-width: 100% !important; /* Make the video responsive */
          display: block !important;
        }

        /* Hide all unnecessary parts of the Instagram embed */
        .instagram-media [role="button"] {
          display: none !important;
        }

        .instagram-media Header {
          display: none !important;
        }

        .instagram-media .InstagramCaption {
          display: none !important;
        }

        .instagram-media footer {
          display: none !important;
        }

        .instagram-media a[href*="comments"],
        .instagram-media a[href*="View profile"],
        .instagram-media a[href*="likes"] {
          display: none !important;
        }

        .instagram-media .c-Yi7,
        .instagram-media .EDfFK.ygqzn {
          display: none !important; /* Hide interaction buttons and comments */
        }
      `}</style>

      {/* Embed for the first Instagram post */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
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
            <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/DAvXRlqSqTr/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
        `,
        }}
      />
    </div>
  );
};

export default InstagramEmbed;
