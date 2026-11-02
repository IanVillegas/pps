// DEC-008A Fecha: selector con formato DD/MM/AAAA.
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// !Modificado para DecPat: se fuerza la versión de escritorio; la móvil anida un diálogo que compite por el foco con el modal.
import { DesktopDatePicker as DatePickerMUI } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { esES } from '@mui/x-date-pickers/locales';
import { useId } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import 'moment/locale/es';
import 'remixicon/fonts/remixicon.css';
import styles from '@/sad-aml-shared/components/Molecules/DatePicker/DatePicker.module.scss';
import { Icon } from '@/sad-aml-shared/components/Atoms';

moment.locale('es');

const calendarTheme = createTheme({
  palette: { primary: { main: '#00998a' } },
  typography: { fontFamily: 'var(--font-poppins), sans-serif' },
});

interface CustomDropdownProps {
  onChange: (date: any) => void;
  label: string;
  value?: string;
  maxDate?: string;
  minDate?: string;
  id?: string;
  errors?: string;
  placeholder?: string;
  disabled?: boolean;
}

const DatePicker = ({
  onChange,
  label,
  value,
  minDate,
  maxDate,
  id,
  errors,
  placeholder = 'Seleccione',
  disabled,
}: CustomDropdownProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = errors ? `${inputId}-error` : undefined;
  const CalendarIcon = () => (
    <Icon color={'gray-400'} name={'ri-calendar-line'} />
  );

  const dateValue = value ? moment(value) : null;

  return (
    <>
      <div className={styles.container}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <ThemeProvider theme={calendarTheme}>
          <LocalizationProvider
            adapterLocale="es"
            dateAdapter={AdapterMoment}
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DatePickerMUI
              className={`${styles.datePicker} ${errors ? styles.datePickerError : ''}`}
              disabled={disabled}
              maxDate={maxDate ? moment(maxDate) : undefined}
              minDate={minDate ? moment(minDate) : undefined}
              onChange={onChange}
              value={dateValue}
              format="DD/MM/YYYY"
              enableAccessibleFieldDOMStructure={false}
              slots={{
                openPickerIcon: CalendarIcon,
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  label: '',
                  id: inputId,
                  error: Boolean(errors),
                  placeholder: !dateValue ? placeholder : '',
                  InputLabelProps: { shrink: false },
                  inputProps: {
                    'aria-invalid': errors ? true : undefined,
                    'aria-describedby': errorId,
                  },
                },
              }}
            />
          </LocalizationProvider>
        </ThemeProvider>
        {errors && (
          <div id={errorId} className={styles.errors} role="alert">
            {errors}
          </div>
        )}
      </div>
    </>
  );
};
export default DatePicker;
