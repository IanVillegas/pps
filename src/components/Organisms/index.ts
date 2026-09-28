// Barril de organismos de DecPat. Mismo criterio que Atoms/index.ts: se
// reexporta sad-aml-shared cuando cubre lo que pide Figma.
export { default as Modal } from '@/sad-aml-shared/components/Organisms/Modal/Modal';
export {
  NotificationProvider,
  useNotification,
  TOAST_MESSAGES,
} from './Notification/NotificationProvider';
export { default as RecordsTable } from './RecordsTable/RecordsTable';
export type { RecordsTableColumn } from './RecordsTable/RecordsTable';
