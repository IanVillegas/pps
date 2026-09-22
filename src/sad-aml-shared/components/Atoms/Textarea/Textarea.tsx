import {
  type TextareaHTMLAttributes,
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
} from 'react';
import styles from './Textarea.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  errors?: string;
  caption?: string;
}

// Atomo generico de texto multilinea; shared no tenia ninguno (solo
// InputText de una linea). Mismo patron de label/error/aria que InputText.
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, errors, caption, id, ...rest }, forwardedRef) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const captionId = caption ? `${textareaId}-caption` : undefined;
    const errorId = errors ? `${textareaId}-error` : undefined;
    const describedBy =
      [captionId, errorId].filter(Boolean).join(' ') || undefined;

    // Sin tirador de resize (a pedido del usuario): el campo crece con el
    // contenido en cada render (incluye el valor inicial al restaurar un
    // borrador) hasta el max-height del SCSS; de ahi en adelante hace
    // scroll interno en vez de seguir creciendo.
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    useLayoutEffect(() => {
      const node = innerRef.current;
      if (!node) return;
      node.style.height = 'auto';
      node.style.height = `${node.scrollHeight}px`;
    });

    return (
      <div className={styles.textarea}>
        <label htmlFor={textareaId} className={styles.textarea__label}>
          {label}
        </label>
        <textarea
          ref={node => {
            innerRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          id={textareaId}
          className={styles.textarea__input}
          aria-invalid={errors ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        <div className={styles.textarea__alerts}>
          {caption && (
            <div id={captionId} className={styles.textarea__captions}>
              {caption}
            </div>
          )}
          {errors && (
            <div id={errorId} className={styles.textarea__errors} role="alert">
              {errors}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
