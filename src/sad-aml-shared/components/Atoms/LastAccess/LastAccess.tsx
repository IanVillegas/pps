'use client';

import styles from '@/sad-aml-shared/components/Atoms/LastAccess/LastAccess.module.scss';
import { useState } from 'react';
//import { getMLVersion } from '~/sad-shared/utils/functions/getMLVersion'
interface LastAccessProps {
  datetime?: string;
}

const LastAccess = (_props: LastAccessProps) => {
  const [versionApp, _setVersionApp] = useState('1.0.3');
  const [_lastLogin, _setLastLogin] = useState('');

  return (
    <div className={styles.lastAccess}>
      <div className={styles.lastAccess__information}>
        <p className={styles.lastAccess__information__subtitle}>
          Versión: {versionApp}
        </p>
      </div>
    </div>
  );
};

export default LastAccess;
