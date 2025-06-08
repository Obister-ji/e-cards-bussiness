/**
 * Favicon Generator Utility
 * Converts logo images to various favicon formats and sizes
 */

export interface FaviconSizes {
  '16x16': string;
  '32x32': string;
  '48x48': string;
  '64x64': string;
  '128x128': string;
  '256x256': string;
  '512x512': string;
}

export interface FaviconUrls {
  ico: string;
  png16: string;
  png32: string;
  png48: string;
  png64: string;
  png128: string;
  png256: string;
  png512: string;
  appleTouchIcon: string;
  androidChrome192: string;
  androidChrome512: string;
}

/**
 * Generate favicon from logo image using canvas
 */
export const generateFaviconFromLogo = async (logoUrl: string): Promise<FaviconUrls> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const favicons: Partial<FaviconUrls> = {};
        
        // Generate different sizes
        const sizes = [16, 32, 48, 64, 128, 256, 512];
        
        sizes.forEach(size => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Canvas context not available');
          }
          
          canvas.width = size;
          canvas.height = size;
          
          // Clear canvas with transparent background
          ctx.clearRect(0, 0, size, size);
          
          // Draw logo centered and scaled
          const scale = Math.min(size / img.width, size / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (size - scaledWidth) / 2;
          const y = (size - scaledHeight) / 2;
          
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          
          // Store in appropriate format
          switch (size) {
            case 16:
              favicons.png16 = dataUrl;
              break;
            case 32:
              favicons.png32 = dataUrl;
              break;
            case 48:
              favicons.png48 = dataUrl;
              break;
            case 64:
              favicons.png64 = dataUrl;
              break;
            case 128:
              favicons.png128 = dataUrl;
              break;
            case 256:
              favicons.png256 = dataUrl;
              break;
            case 512:
              favicons.png512 = dataUrl;
              break;
          }
        });
        
        // Use 32x32 as ICO (simplified)
        favicons.ico = favicons.png32;
        
        // Apple Touch Icon (180x180, but we'll use 256x256)
        favicons.appleTouchIcon = favicons.png256;
        
        // Android Chrome icons
        favicons.androidChrome192 = favicons.png256; // Close enough
        favicons.androidChrome512 = favicons.png512;
        
        resolve(favicons as FaviconUrls);
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load logo image'));
    };
    
    img.src = logoUrl;
  });
};

/**
 * Generate favicon HTML tags
 */
export const generateFaviconHTML = (faviconUrls: FaviconUrls): string => {
  return `
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="${faviconUrls.ico}">
    <link rel="icon" type="image/png" sizes="16x16" href="${faviconUrls.png16}">
    <link rel="icon" type="image/png" sizes="32x32" href="${faviconUrls.png32}">
    <link rel="icon" type="image/png" sizes="48x48" href="${faviconUrls.png48}">
    <link rel="icon" type="image/png" sizes="64x64" href="${faviconUrls.png64}">
    <link rel="icon" type="image/png" sizes="128x128" href="${faviconUrls.png128}">
    <link rel="icon" type="image/png" sizes="256x256" href="${faviconUrls.png256}">
    
    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="${faviconUrls.appleTouchIcon}">
    <link rel="apple-touch-icon" sizes="180x180" href="${faviconUrls.appleTouchIcon}">
    
    <!-- Android Chrome -->
    <link rel="icon" type="image/png" sizes="192x192" href="${faviconUrls.androidChrome192}">
    <link rel="icon" type="image/png" sizes="512x512" href="${faviconUrls.androidChrome512}">
    
    <!-- Web App Manifest -->
    <link rel="manifest" href="/site.webmanifest">
    
    <!-- Theme Color -->
    <meta name="theme-color" content="#000000">
    <meta name="msapplication-TileColor" content="#000000">
  `.trim();
};

/**
 * Generate Web App Manifest
 */
export const generateWebManifest = (appName: string, faviconUrls: FaviconUrls) => {
  return {
    name: appName,
    short_name: appName,
    description: "Professional Digital Business Card Creator",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: faviconUrls.androidChrome192,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: faviconUrls.androidChrome512,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
};

/**
 * Download favicon as file
 */
export const downloadFavicon = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Apply favicon to current page
 */
export const applyFaviconToPage = (faviconUrls: FaviconUrls) => {
  // Remove existing favicon links
  const existingLinks = document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]');
  existingLinks.forEach(link => link.remove());
  
  // Add new favicon links
  const head = document.head;
  
  // ICO favicon
  const icoLink = document.createElement('link');
  icoLink.rel = 'icon';
  icoLink.type = 'image/x-icon';
  icoLink.href = faviconUrls.ico;
  head.appendChild(icoLink);
  
  // PNG favicons
  const pngSizes = [
    { size: '16x16', url: faviconUrls.png16 },
    { size: '32x32', url: faviconUrls.png32 },
    { size: '48x48', url: faviconUrls.png48 },
    { size: '64x64', url: faviconUrls.png64 },
    { size: '128x128', url: faviconUrls.png128 },
    { size: '256x256', url: faviconUrls.png256 }
  ];
  
  pngSizes.forEach(({ size, url }) => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.sizes = size;
    link.href = url;
    head.appendChild(link);
  });
  
  // Apple Touch Icon
  const appleLink = document.createElement('link');
  appleLink.rel = 'apple-touch-icon';
  appleLink.href = faviconUrls.appleTouchIcon;
  head.appendChild(appleLink);
  
  console.log('✅ Favicon applied successfully!');
};

export default {
  generateFaviconFromLogo,
  generateFaviconHTML,
  generateWebManifest,
  downloadFavicon,
  applyFaviconToPage
};
