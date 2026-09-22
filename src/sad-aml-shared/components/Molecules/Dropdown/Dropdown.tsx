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
              className={styles.customDropdown__select}
              position="popper"
            >
              <div
                className={`${
                  isShort
                    ? styles.customDropdown__heightScrollAreasShort
                    : styles.customDropdown__heightScrollAreas
                } ${styles.customDropdown__scrollAreaRoot}`}
              >
                <div className={styles.customDropdown__scrollAreaViewport}>
                  <Select.Viewport asChild>
                    <div>
                      {options ? (
                        <>
                          {options.length > 0 ? (
                            options.map(element => (
                              <Select.Item
                                className={styles.customDropdown__option}
                                value={element.value}
                                key={element.value}
                              >
                                {isStringElement(element.element) ? (
                                  <Select.ItemText
                                    style={{
                                      display: 'none',
                                    }}
                                  >
                                    {element.element}
                                  </Select.ItemText>
                                ) : (
                                  element.element
                                )}
                              </Select.Item>
                            ))
                          ) : (
                            <Select.Item
                              disabled
                              value={'0'}
                              key="empty"
                              className={`${styles.customDropdown__option} ${styles.emptyValue}`}
                            >
                              {labelNoRegister}
                            </Select.Item>
                          )}
                        </>
                      ) : (
                        <>
                          {multiOptions?.map(group => {
                            return (
                              <Select.Group key={group.label}>
                                <Select.Label
                                  className={styles.customDropdown__labelGroup}
                                >
                                  {group.label}
                                </Select.Label>
                                {group.options?.length > 0 ? (
                                  group.options?.map(element => (
                                    <Select.Item
                                      className={styles.customDropdown__option}
                                      value={element.value.toString()}
                                      key={element.value}
                                    >
                                      {isStringElement(element.element) ? (
                                        <Select.ItemText
                                          style={{
                                            display: 'none',
                                          }}
                                        >
                                          {element.element}
                                        </Select.ItemText>
                                      ) : (
                                        element.element
                                      )}
                                    </Select.Item>
                                  ))
                                ) : (
                                  <Select.Item
                                    value={'0'}
                                    key="empty"
                                    className={`${styles.customDropdown__option} ${styles.emptyValue}`}
                                    disabled
                                  >
                                    {labelNoRegister}
                                  </Select.Item>
                                )}
                              </Select.Group>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </Select.Viewport>
                </div>
              </div>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
