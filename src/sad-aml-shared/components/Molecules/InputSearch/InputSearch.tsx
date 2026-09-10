// Search.tsx
import type { ChangeEvent } from 'react';
import React from 'react';
import { Button } from '@/sad-aml-shared/components/Atoms';
import styles from '@/sad-aml-shared/components/Molecules/InputSearch/InputSearch.module.scss';
import { useTranslation } from 'react-i18next';
import { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';

interface SearchProps {
  onSearch: (searchValue: string) => void;
  placeholder?: string;
  helperText?: string;
  onClick?: () => void;
  value?: string;
  searchButton?: boolean;
  loading?: boolean;
}

const Search: React.FC<SearchProps> = ({
  onSearch,
  placeholder = 'Escriba el nombre del servicio o número de referencia',
  helperText = '',
  onClick,
  value,
  searchButton,
  loading = false,
}) => {
  const [t] = useTranslation('global');
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <>
      <div className={styles.searchWrapper}>
        <div className={styles.search}>
          <input
            type="text"
            className={styles.search__input}
            onChange={handleSearch}
            placeholder={placeholder}
            value={value ?? ''}
          />
          <button
            className={styles.search__icon}
            onClick={onClick}
            title="Buscar"
          >
            <i className="ri-search-2-line" />
          </button>
        </div>

        {searchButton && (
          <div className={styles.searchButton}>
            <Button
              text={t('global:button.search')}
              color={ColorEnum.Primary}
              size="medium"
              onClick={onClick}
              spinner={loading}
            />
          </div>
        )}
      </div>
      <span className={styles.helperText}>{helperText}</span>
    </>
  );
};

export default Search;
