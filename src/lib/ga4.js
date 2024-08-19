export const GA_TRACKING_ID = 'G-ZDQZK8XNHY'; 
// Function to initialize GA4
export const initGA = () => {
  if (!window.dataLayer) {
    window.dataLayer = [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Function to log page views
export const logPageView = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
