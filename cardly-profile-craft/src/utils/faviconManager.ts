// Favicon Manager - Uses logo folder for site icons
export interface FaviconConfig {
  sizes: number[];
  formats: ('png' | 'ico' | 'svg')[];
  appleTouchIcon: boolean;
  manifest: boolean;
}

export interface GeneratedFavicons {
  favicon16: string;
  favicon32: string;
  favicon48: string;
  appleTouchIcon: string;
  manifest: string;
}

export class FaviconManager {
  private static instance: FaviconManager;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  static getInstance(): FaviconManager {
    if (!FaviconManager.instance) {
      FaviconManager.instance = new FaviconManager();
    }
    return FaviconManager.instance;
  }

  // Generate favicon from logo image
  async generateFaviconsFromLogo(logoPath: string = '/logo/logo.jpeg'): Promise<GeneratedFavicons> {
    try {
      const img = await this.loadImage(logoPath);
      
      return {
        favicon16: this.generateFaviconSize(img, 16),
        favicon32: this.generateFaviconSize(img, 32),
        favicon48: this.generateFaviconSize(img, 48),
        appleTouchIcon: this.generateFaviconSize(img, 180),
        manifest: this.generateManifestIcon(img, 192)
      };
    } catch (error) {
      console.warn('Failed to generate favicons from logo, using fallback:', error);
      return this.generateFallbackFavicons();
    }
  }

  // Load image from path
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  // Generate favicon of specific size
  private generateFaviconSize(img: HTMLImageElement, size: number): string {
    this.canvas.width = size;
    this.canvas.height = size;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, size, size);
    
    // Add subtle background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, size, size);
    
    // Calculate dimensions to maintain aspect ratio
    const aspectRatio = img.width / img.height;
    let drawWidth = size;
    let drawHeight = size;
    let offsetX = 0;
    let offsetY = 0;

    if (aspectRatio > 1) {
      drawHeight = size / aspectRatio;
      offsetY = (size - drawHeight) / 2;
    } else {
      drawWidth = size * aspectRatio;
      offsetX = (size - drawWidth) / 2;
    }

    // Draw image with padding
    const padding = size * 0.1;
    this.ctx.drawImage(
      img,
      offsetX + padding,
      offsetY + padding,
      drawWidth - (padding * 2),
      drawHeight - (padding * 2)
    );

    return this.canvas.toDataURL('image/png');
  }

  // Generate manifest icon (larger, no background)
  private generateManifestIcon(img: HTMLImageElement, size: number): string {
    this.canvas.width = size;
    this.canvas.height = size;
    
    // Clear canvas (transparent background for manifest)
    this.ctx.clearRect(0, 0, size, size);
    
    // Calculate dimensions
    const aspectRatio = img.width / img.height;
    let drawWidth = size;
    let drawHeight = size;
    let offsetX = 0;
    let offsetY = 0;

    if (aspectRatio > 1) {
      drawHeight = size / aspectRatio;
      offsetY = (size - drawHeight) / 2;
    } else {
      drawWidth = size * aspectRatio;
      offsetX = (size - drawWidth) / 2;
    }

    // Draw image
    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    return this.canvas.toDataURL('image/png');
  }

  // Generate fallback favicons if logo fails
  private generateFallbackFavicons(): GeneratedFavicons {
    const generateFallback = (size: number): string => {
      this.canvas.width = size;
      this.canvas.height = size;
      
      // Create gradient background
      const gradient = this.ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#8b5cf6');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, size, size);
      
      // Add text
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = `bold ${size * 0.4}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('BC', size / 2, size / 2);
      
      return this.canvas.toDataURL('image/png');
    };

    return {
      favicon16: generateFallback(16),
      favicon32: generateFallback(32),
      favicon48: generateFallback(48),
      appleTouchIcon: generateFallback(180),
      manifest: generateFallback(192)
    };
  }

  // Apply favicons to the page
  applyFavicons(favicons: GeneratedFavicons): void {
    // Remove existing favicons
    this.removeExistingFavicons();

    // Add new favicons
    this.addFaviconLink('icon', favicons.favicon32, '32x32');
    this.addFaviconLink('icon', favicons.favicon16, '16x16');
    this.addFaviconLink('apple-touch-icon', favicons.appleTouchIcon, '180x180');

    // Note: We keep the static manifest.json instead of dynamically generating it
    // to avoid blob URL issues that cause PWA manifest warnings

    console.log('✅ Favicons applied successfully');
  }

  // Remove existing favicon links
  private removeExistingFavicons(): void {
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
  }

  // Add favicon link to head
  private addFaviconLink(rel: string, href: string, sizes?: string): void {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (sizes) link.sizes = sizes;
    link.type = 'image/png';
    document.head.appendChild(link);
  }

  // Note: Manifest is now handled by static manifest.json file
  // to avoid blob URL issues that cause PWA warnings

  // Initialize favicons on app start
  async initializeFavicons(): Promise<void> {
    try {
      const favicons = await this.generateFaviconsFromLogo();
      this.applyFavicons(favicons);
    } catch (error) {
      console.error('Failed to initialize favicons:', error);
      // Apply fallback favicons
      const fallbackFavicons = this.generateFallbackFavicons();
      this.applyFavicons(fallbackFavicons);
    }
  }
}

// Export singleton instance
export const faviconManager = FaviconManager.getInstance();

// Note: Initialization is handled by App.tsx to avoid duplicate calls
