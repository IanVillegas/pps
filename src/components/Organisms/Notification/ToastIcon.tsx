export type ToastKind = 'success' | 'error' | 'warning';

// Iconos "icon-m" del nodo Figma 43250:8104 (mismos paths exportados): un aro
// blanco al 50 %, un circulo del color del toast y el simbolo en blanco.
const ICONS: Record<ToastKind, { color: string; path: string }> = {
  success: {
    color: '#25CF7E',
    path: 'M23.3335 26.4679L28.9044 20.8964L29.7619 21.7534L23.3335 28.1818L19.4765 24.3249L20.3335 23.4679L23.3335 26.4679Z',
  },
  error: {
    color: '#D23D3D',
    path: 'M24.5456 23.6885L27.5456 20.6885L28.4025 21.5455L25.4025 24.5455L28.4025 27.5455L27.5456 28.4024L24.5456 25.4024L21.5456 28.4024L20.6886 27.5455L23.6886 24.5455L20.6886 21.5455L21.5456 20.6885L24.5456 23.6885Z',
  },
  warning: {
    color: '#F5CB5C',
    path: 'M25.8 18.8188L31.5751 28.8219C31.6283 28.914 31.6564 29.0186 31.6564 29.125C31.6564 29.2314 31.6283 29.336 31.5751 29.4281C31.5219 29.5203 31.4454 29.5968 31.3532 29.65C31.2611 29.7032 31.1565 29.7312 31.0501 29.7313H19.4999C19.3934 29.7312 19.2889 29.7032 19.1967 29.65C19.1046 29.5968 19.028 29.5203 18.9748 29.4281C18.9216 29.336 18.8936 29.2314 18.8936 29.125C18.8936 29.0186 18.9216 28.914 18.9748 28.8219L24.75 18.8188C24.8032 18.7266 24.8797 18.6501 24.9719 18.5969C25.064 18.5437 25.1686 18.5157 25.275 18.5157C25.3814 18.5157 25.4859 18.5437 25.5781 18.5969C25.6703 18.6501 25.7468 18.7266 25.8 18.8188V18.8188ZM20.5499 28.5188H30.0001L25.275 20.3344L20.5499 28.5188V28.5188ZM24.6687 26.7H25.8812V27.9125H24.6687V26.7ZM24.6687 22.4563H25.8812V25.4875H24.6687V22.4563Z',
  },
};

export const TOAST_COLORS: Record<ToastKind, string> = {
  success: ICONS.success.color,
  error: ICONS.error.color,
  warning: ICONS.warning.color,
};

interface ToastIconProps {
  kind: ToastKind;
  className?: string;
}

const ToastIcon = ({ kind, className }: ToastIconProps) => (
  <svg
    className={className}
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="25" cy="25" r="25" fill="white" opacity="0.5" />
    <circle cx="25.0001" cy="25" r="15.9091" fill={ICONS[kind].color} />
    <path d={ICONS[kind].path} fill="white" />
  </svg>
);

export default ToastIcon;
