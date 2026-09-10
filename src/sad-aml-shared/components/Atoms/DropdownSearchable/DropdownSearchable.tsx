import {
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
} from '@mui/material';
import 'remixicon/fonts/remixicon.css';
import React from 'react';

interface SearchableDropdownProps {
  options: { label: string; value: string }[];
  value: { label: string; value: string } | null;
  onChange: (value: { label: string; value: string } | null) => void;
  placeholder?: string;
  iconName?: string; // Remix icon class name, e.g. "ri-user-line"
  disabled?: boolean;
  dropdownItems?: React.ReactNode[]; // Array de elementos JSX, uno por opción
}

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Seleccione una opción',
  iconName,
  disabled = false,
  dropdownItems,
}: SearchableDropdownProps) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      size="small"
      style={{ position: 'relative', minWidth: 120, maxWidth: 320 }}
    >
      {placeholder && <InputLabel>{placeholder}</InputLabel>}
      <Select
        value={value ? value.value : ''}
        onChange={e => {
          const selected =
            options.find(opt => opt.value === e.target.value) || null;
          onChange(selected);
        }}
        label={placeholder}
        disabled={disabled}
        startAdornment={
          iconName ? (
            <InputAdornment position="start">
              <i
                className={iconName}
                style={{ fontSize: 18, color: '#9e9e9e' }}
              />
            </InputAdornment>
          ) : null
        }
        renderValue={selected => {
          const idx = options.findIndex(opt => opt.value === selected);
          if (dropdownItems && dropdownItems[idx]) return dropdownItems[idx];
          const opt = options.find(opt => opt.value === selected);
          return opt ? opt.label : '';
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 240,
              minWidth: 120,
            },
          },
        }}
        style={{ fontSize: 14, padding: 0 }}
      >
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {options.map((option, idx) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={{ fontSize: 14, padding: '6px 12px' }}
          >
            {dropdownItems && dropdownItems[idx]
              ? dropdownItems[idx]
              : option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SearchableDropdown;
