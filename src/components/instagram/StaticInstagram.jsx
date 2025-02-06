"use client";
import { useEffect } from "react";

const instagramLinks = [
  "https://www.instagram.com/reel/DFsmjP_t98e/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DFaUK16oTwC/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DFIao9eyOGO/?utm_source=ig_embed&amp;utm_campaign=loading",
  "https://www.instagram.com/reel/DEmg7lSyZe4/?utm_source=ig_embed&amp;utm_campaign=loading",
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
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
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
          gap: 1.5rem;
          padding: 2rem;
          overflow: hidden;
        }

        .instagram-embed-container > div {
          position: relative;
          border-radius: 15px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          animation: fadeIn 0.6s ease;
          overflow: hidden;
        }

        .instagram-embed-container > div:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
        }

        .instagram-embed-container > div iframe {
          width: 100%;
          height: 100%;
          border: none;
          pointer-events: auto; /* Ensures iframe is clickable */
          transition: transform 0.4s ease;
        }

        .instagram-embed-container > div:hover iframe {
          transform: scale(1.03);
        }

        .instagram-embed-container > div::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3),
            transparent 70%
          );
          z-index: 1;
          pointer-events: none; /* Prevents blocking iframe interactions */
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .instagram-embed-container > div:hover::after {
          opacity: 1;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
