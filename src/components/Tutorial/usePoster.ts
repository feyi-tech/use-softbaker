import { Image as Img } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';

interface Poster {
    siteLogoUrl?: string,
    noisyWidth: number,
    noisyHeight: number,
}

const createNoisyPoster = (
    siteLogoUrl: string,
    noisyWidth: number,
    noisyHeight: number,
    logoWidth: number,
    logoHeight: number
  ): string | null => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return null
    }
  
    const img = new Image();
    img.src = siteLogoUrl;
  
    // Set canvas size to match the noisy image
    canvas.width = noisyWidth;
    canvas.height = noisyHeight;
  
    // Calculate the position to center the logo
    const x = (noisyWidth - logoWidth) / 2;
    const y = (noisyHeight - logoHeight) / 2;
  
    // Draw the logo onto the canvas at the center
    ctx.drawImage(img, x, y, logoWidth, logoHeight);
  
    // Apply noisy effect
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      // Add random noise to each pixel
      data[i] = data[i] + Math.random() * 20 - 10; // Red channel
      data[i + 1] = data[i + 1] + Math.random() * 20 - 10; // Green channel
      data[i + 2] = data[i + 2] + Math.random() * 20 - 10; // Blue channel
    }
  
    ctx.putImageData(imageData, 0, 0);
  
    // Convert canvas to base64
    const base64 = canvas.toDataURL('image/png');
  
    return base64;
};
  

const usePoster = ({ siteLogoUrl, noisyWidth, noisyHeight }: Poster) => {
  const [ noisyPoster, setNoisyPoster ] = useState<string | undefined>()

  useEffect(() => {
    if (siteLogoUrl) {
      // Create and set the noisy poster as the src
      const noisy = createNoisyPoster(siteLogoUrl, noisyWidth, noisyHeight, 64, 64)
      if(noisy) setNoisyPoster(noisy)
    }
  }, [siteLogoUrl]);

  if(noisyPoster) {
    return noisyPoster;

  } else {
    return siteLogoUrl;
  }
};

export default usePoster;