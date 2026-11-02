import React from 'react';
import styles from './TitleWithDrawable.module.scss';
import type { TitleWithDrawableProps } from '@/sad-aml-shared/components/Atoms/TitleWithDrawable/TitleWithDrawable.type';

/**
 * Renders a title with optional drawable elements on each side (left, right, top, bottom).
 *
 * @param text - The main title text to display.
 * @param className - Optional custom class name for the title element.
 * @param leftElement - Optional React node to render to the left of the title.
 * @param rightElement - Optional React node to render to the right of the title.
 * @param topElement - Optional React node to render above the title row.
 * @param bottomElement - Optional React node to render below the title row.
 *
 * @returns A container with the title and optional drawable elements.
 */
const TitleWithDrawable = ({
  text,
  className,
  leftElement,
  rightElement,
  topElement,
  bottomElement,
  customClass,
}: TitleWithDrawableProps) => {
  return (
    <div className={styles.container}>
      {topElement && <div className={styles.topElement}>{topElement}</div>}
      <div className={styles.middleRow}>
        {leftElement && <div className={styles.leftElement}>{leftElement}</div>}

        <h2
          className={`${customClass ? styles[customClass] : ''} ${className ? className : styles.text}`}
        >
          {text}
        </h2>

        {rightElement && (
          <div className={styles.rightElement}>{rightElement}</div>
        )}
      </div>
      {bottomElement && (
        <div className={styles.bottomElement}>{bottomElement}</div>
      )}
    </div>
  );
};

export default TitleWithDrawable;
