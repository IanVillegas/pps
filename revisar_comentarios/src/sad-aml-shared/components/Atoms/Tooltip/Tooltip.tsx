'use client';

import type { ReactElement } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import styles from './Tooltip.module.scss';

interface TooltipProps {
  /** Texto que se muestra en el globo */
  content: string;
  /** Un unico elemento enfocable */
  children: ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';

  delayDuration?: number;
}

const Tooltip = ({
  content,
  children,
  side = 'bottom',
  delayDuration = 200,
}: TooltipProps) => (
  <RadixTooltip.Provider delayDuration={delayDuration}>
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className={styles.tooltip}
          side={side}
          sideOffset={8}
          collisionPadding={8}
        >
          {content}
          <RadixTooltip.Arrow className={styles.tooltip__arrow} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
);

export default Tooltip;
