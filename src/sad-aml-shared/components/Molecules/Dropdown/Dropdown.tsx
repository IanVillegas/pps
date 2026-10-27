import { forwardRef, useId, useState, type ReactNode } from 'react';
import 'remixicon/fonts/remixicon.css';

import * as Select from '@radix-ui/react-select';
import styles from '@/sad-aml-shared/components/Molecules/Dropdown/Dropdown.module.scss';
import { isStringElement } from '@/sad-aml-shared/utils/helpers/stringHelpers';

interface DropdownOption {
  value: string;
  element: ReactNode;
}

interface CustomDropdownProps {
  isShort?: boolean;
  options?: DropdownOption[];
  placeholder: string;
  label?: string;
  onChange: (item: string) => void;
  disabled?: boolean;
  value?: string;
  labelNoRegister?: string;
  multiOptions?: {
    label: string;
    options: DropdownOption[];
  }[];
  id?: string;
  errors?: string;
}

// Una opcion: el texto (o el elemento que se pase) y, a la derecha, una marca
// en la elegida. // !Modificado para DecPat (2026-10-27): rediseno de la lista.
const renderOption = (element: DropdownOption) => (
  <Select.Item
    className={styles.customDropdown__option}
    value={element.value.toString()}
    key={element.value}
  >
    {isStringElement(element.element) ? (
      <Select.ItemText>{element.element}</Select.ItemText>
    ) : (
      element.element
    )}
    <Select.ItemIndicator className={styles.customDropdown__check}>
      <i className="ri-check-line" aria-hidden="true" />
    </Select.ItemIndicator>
  </Select.Item>
);

const Dropdown = forwardRef<HTMLButtonElement, CustomDropdownProps>(
  (
    {
      options,
      placeholder,
      label,
      onChange,
      disabled,
      value,
      labelNoRegister = 'Sin registros',
      multiOptions,
      isShort,
      id,
      errors,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const errorId = errors ? `${triggerId}-error` : undefined;

    return (
      // Select.Root no renderiza ningun elemento propio (solo provee
      // contexto), asi que sin este div el label y el trigger quedarian
      // como hermanos sueltos en el padre real -- dos celdas en vez de una
      // dentro de un contenedor flex/grid (confirmado con un grid de 2
      // columnas en DEC-007: cada Dropdown corria la fila siguiente).
      <div className={styles.dropdown}>
        <Select.Root
          onValueChange={onChange}
          value={value}
          defaultValue={undefined}
          open={open}
          onOpenChange={setOpen}
        >
          {/* Un <label htmlFor> real: Select.Label solo etiqueta un grupo de
            opciones dentro de Select.Content (ver SelectGroup de Radix), no
            el control. Usado como grupo aqui, quedaba sin ninguna relacion
            programatica con el trigger (nombre accesible ausente). */}
          {label && (
            <label htmlFor={triggerId} className={styles.label}>
              {label}
            </label>
          )}

          <Select.Trigger
            ref={ref}
            id={triggerId}
            disabled={disabled}
            className={styles.customDropdown}
            aria-invalid={errors ? true : undefined}
            aria-describedby={errorId}
          >
            <Select.Value placeholder={placeholder} />
            <Select.Icon className={styles.customDropdown__selectIcon}>
              <i
                className={open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}
              ></i>
            </Select.Icon>
          </Select.Trigger>
          {errors && (
            <div
              id={errorId}
              className={styles.customDropdown__errors}
              role="alert"
            >
              {errors}
            </div>
          )}

          <Select.Portal>
            <Select.Content
              className={`${styles.customDropdown__select} ${
                isShort ? styles['customDropdown__select--short'] : ''
              }`}
              position="popper"
              sideOffset={4}
              collisionPadding={12}
            >
              <Select.Viewport className={styles.customDropdown__viewport}>
                {options ? (
                  options.length > 0 ? (
                    options.map(element => renderOption(element))
                  ) : (
                    <div className={styles.customDropdown__empty}>
                      {labelNoRegister}
                    </div>
                  )
                ) : (
                  multiOptions?.map(group => (
                    <Select.Group key={group.label}>
                      <Select.Label
                        className={styles.customDropdown__labelGroup}
                      >
                        {group.label}
                      </Select.Label>
                      {group.options?.length > 0 ? (
                        group.options.map(element => renderOption(element))
                      ) : (
                        <div className={styles.customDropdown__empty}>
                          {labelNoRegister}
                        </div>
                      )}
                    </Select.Group>
                  ))
                )}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
