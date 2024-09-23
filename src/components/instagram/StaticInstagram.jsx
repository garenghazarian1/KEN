
  "use client"
  import { useEffect } from 'react';

const InstagramEmbed = () => {
  useEffect(() => {
    // Inject the Instagram embed script
    const script = document.createElement('script');
    script.setAttribute('src', 'https://www.instagram.com/embed.js');
    script.setAttribute('async', 'true');
    document.body.appendChild(script);

    // Load the embed script to process the embeds
    script.onload = () => {
      // This function is provided by the Instagram embed.js script to process embeds
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
    <div className="instagram-embed-container" dangerouslySetInnerHTML={{
      __html: `
        <style>
          .instagram-media {
            max-height: 500px !important;
          }
          .instagram-media iframe {
            margin: auto !important;
          }
          .instagram-media [role='button'], .instagram-media header, .instagram-media .InstagramCaption, .instagram-media footer {
            display: none !important;
          }
        </style>
        <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/C3c9gsRxDOg/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
      <!-- Content -->
    </blockquote>
      `
    }} />
  );
};

export default InstagramEmbed;
