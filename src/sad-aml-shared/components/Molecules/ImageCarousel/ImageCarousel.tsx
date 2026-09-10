import React, { useEffect, useState } from 'react';
import styles from './ImageCarousel.module.scss';
import { Picture } from '@/sad-aml-shared/components/Atoms';

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carousel}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <Picture src={image.src} alt={image.alt} width={2148} height={1024} />
        </div>
      ))}

      <div className={styles.dots}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
