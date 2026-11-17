import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';
const { backdrop, dialog, module } = styles;

const modalStack = [];

function Modal({
  titleId,
  onClose,
  children,
  alert = false,
  className,
  contentClassName,
  closeOnBackdrop = true,
}) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    modalStack.push(dialog);
    document.body.style.overflow = 'hidden';
    dialog?.focus();

    function handleKeyDown(event) {
      if (modalStack.at(-1) !== dialog) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = [
        ...dialog.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((element) => element.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable.at(-1).focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === focusable.at(-1)
      ) {
        event.preventDefault();
        focusable[0].focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const stackIndex = modalStack.lastIndexOf(dialog);
      if (stackIndex >= 0) modalStack.splice(stackIndex, 1);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
      else modalStack.at(-1)?.focus();
    };
  }, []);

  return (
    <div
      className={`${backdrop} ${className ?? ''}`}
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget)
          onClose?.();
      }}
    >
      <section
        ref={dialogRef}
        className={`${dialog} ${contentClassName ?? ''}`}
        role={alert ? 'alertdialog' : 'dialog'}
        aria-modal='true'
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {children}
      </section>
    </div>
  );
}

export default Modal;
