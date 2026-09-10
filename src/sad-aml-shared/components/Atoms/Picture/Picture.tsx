import React from 'react';
import Image from 'next/image';
import styles from '@/sad-aml-shared/components/Atoms/Picture/Picture.module.scss';

type PictureProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

const Picture = ({
  src,
  alt,
  width = 500,
  height = 300,
  className = styles.container__logo,
}: PictureProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Picture;
