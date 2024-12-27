"use client";
import { useEffect } from "react";

const instagramLinks = [
  "https://www.instagram.com/reel/DDuLPatSDsE/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DDcZ77OzDNQ/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DDWrR6rSt7t/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DC9dIVSBLb3/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DDR8MMVSYWf/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DDMvoQZPTAD/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DDMKZTCyLCs/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DDCPB-JSAXl/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DC9dIVSBLb3/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DC4egODhnCv/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCCAjjsyBZW/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DC1qHLQSFen/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCzWY26BTRG/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCrYuNxMmpF/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCovWxDSn6c/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCo6PL4olnB/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCmPJVvB0NM/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCbiqFBSroG/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/p/DCb79hXB8Um/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCZItUzNk7l/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCWyUVRBwkS/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCUtdFXCiNP/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DCCAjjsyBZW/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/p/DCBxhcOSbTe/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DB_uBYztqIx/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DB89gC2ycom/?utm_source=ig_embed&amp;utm_campaign=loading",
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
    const script = document.createElement("script");
    script.setAttribute("src", "https://www.instagram.com/embed.js");
    script.setAttribute("async", "true");
    document.body.appendChild(script);

    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="instagram-embed-container">
      <style jsx>{`
        .instagram-embed-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          padding: 1rem;
        }

        .instagram-embed-container > div {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .instagram-embed-container > div iframe {
          width: 100%;
          height: 100%;
          border: none;
          background-color: transparent;
        }

        .instagram-media {
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          background: none !important;
        }

        .instagram-media header,
        .instagram-media footer,
        .instagram-media [role="button"],
        .instagram-media .InstagramCaption {
          display: none !important;
        }

        @media (max-width: 768px) {
          .instagram-embed-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {instagramLinks.map((link, index) => (
        <div
          key={index}
          dangerouslySetInnerHTML={{
            __html: `
              <blockquote class="instagram-media" data-instgrm-permalink="${link}" data-instgrm-version="14"></blockquote>
            `,
          }}
        />
      ))}
    </div>
  );
};

export default InstagramEmbed;
