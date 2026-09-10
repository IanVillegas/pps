import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker as DatePickerMUI } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { esES } from '@mui/x-date-pickers/locales';
import moment from 'moment';
import 'moment/locale/es';
import 'remixicon/fonts/remixicon.css';
import styles from '@/sad-aml-shared/components/Molecules/DatePicker/DatePicker.module.scss';
import { Icon } from '@/sad-aml-shared/components/Atoms';

moment.locale('es');

interface CustomDropdownProps {
  onChange: (date: any) => void;
  label: string;
  value?: string;
  maxDate?: string;
  minDate?: string;
}

const DatePicker = ({
  onChange,
  label,
  value,
  minDate,
  maxDate,
}: CustomDropdownProps) => {
  const CalendarIcon = () => (
    <Icon color={'gray-400'} name={'ri-calendar-line'} />
  );

  const dateValue = value ? moment(value) : null;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.label}>{label}</div>
        <LocalizationProvider
          adapterLocale="es"
          dateAdapter={AdapterMoment}
          localeText={
            esES.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <DatePickerMUI
            className={styles.datePicker}
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
                placeholder: !dateValue ? 'Seleccione' : '',
                InputLabelProps: { shrink: false },
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </>
  );
};
export default DatePicker;
