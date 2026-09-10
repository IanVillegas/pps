import { useState, type ReactNode } from 'react';
import 'remixicon/fonts/remixicon.css';

import * as Select from '@radix-ui/react-select';
import { randomKey } from '@/sad-aml-shared/utils/functions/randomKey';
import styles from '@/sad-aml-shared/components/Molecules/Dropdown/Dropdown.module.scss';
import { isStringElement } from '@/sad-aml-shared/utils/helpers/stringHelpers';

interface CustomDropdownProps {
  isShort?: boolean;
  options?: {
    value: string;
    element: ReactNode;
  }[];
  placeholder: string;
  label?: string;
  onChange: (item: string) => void;
  disabled?: boolean;
  value?: string;
  labelNoRegister?: string;
  multiOptions?: {
    label: string;
    options: {
      value: string;
      element: ReactNode;
    }[];
  }[];
}

const Dropdown = ({
  options,
  placeholder,
  label,
  onChange,
  disabled,
  value,
  labelNoRegister = 'Sin registros',
  multiOptions,
  isShort,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Select.Root
      onValueChange={onChange}
      value={value}
      defaultValue={undefined}
      open={open}
      onOpenChange={setOpen}
    >
      {label && (
        <Select.Group>
          <Select.Label className={styles.label}>{label}</Select.Label>
        </Select.Group>
      )}

      <Select.Trigger disabled={disabled} className={styles.customDropdown}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={styles.customDropdown__selectIcon}>
          <i
            className={open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}
          ></i>
        </Select.Icon>
      </Select.Trigger>

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
                            key={randomKey('key-dropdown-item-')}
                          >
                            {isStringElement(element.element) ? (
                              <Select.ItemText
                                style={{
                                  display: 'none',
                                }}
                                key={randomKey(element.value)}
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
                          key={randomKey('key-dropdown-item-')}
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
                          <Select.Group key={randomKey('SelectGrupo')}>
                            <Select.Label
                              className={styles.customDropdown__labelGroup}
                            >
                              {group.label}
                            </Select.Label>
                            {group.options?.length > 0 ? (
                              group.options?.map((element: any) => (
                                <Select.Item
                                  className={styles.customDropdown__option}
                                  value={element.value.toString()}
                                  key={randomKey('key-dropdown-item-')}
                                >
                                  {isStringElement(element.element) ? (
                                    <Select.ItemText
                                      style={{
                                        display: 'none',
                                      }}
                                      key={randomKey(element.value)}
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
                                key={randomKey('key-dropdown-item-')}
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
  );
};
export default Dropdown;
