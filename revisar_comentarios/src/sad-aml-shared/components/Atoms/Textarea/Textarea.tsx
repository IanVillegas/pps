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

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, errors, caption, id, ...rest }, forwardedRef) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const captionId = caption ? `${textareaId}-caption` : undefined;
    const errorId = errors ? `${textareaId}-error` : undefined;
    const describedBy =
      [captionId, errorId].filter(Boolean).join(' ') || undefined;

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
