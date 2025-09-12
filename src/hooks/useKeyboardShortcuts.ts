import { useEffect, useCallback } from 'react';

export interface KeyboardShortcuts {
  onToggleView?: () => void;
  onToggleDarkMode?: () => void;
  onToggleStats?: () => void;
  onFocusSearch?: () => void;
  onRefresh?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable elements
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.closest('[contenteditable]')
      ) {
        return;
      }

      // Check for modifier keys
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      const isAlt = event.altKey;

      // Prevent default behavior for our shortcuts
      const preventDefault = () => {
        event.preventDefault();
        event.stopPropagation();
      };

      // Keyboard shortcuts
      switch (event.key.toLowerCase()) {
        case 'v':
          if (isCtrlOrCmd && !isShift && !isAlt) {
            preventDefault();
            shortcuts.onToggleView?.();
          }
          break;

        case 'd':
          if (isCtrlOrCmd && !isShift && !isAlt) {
            preventDefault();
            shortcuts.onToggleDarkMode?.();
          }
          break;

        case 's':
          if (isCtrlOrCmd && !isShift && !isAlt) {
            preventDefault();
            shortcuts.onToggleStats?.();
          }
          break;

        case 'f':
          if (isCtrlOrCmd && !isShift && !isAlt) {
            preventDefault();
            shortcuts.onFocusSearch?.();
          }
          break;

        case 'r':
          if (isCtrlOrCmd && !isShift && !isAlt) {
            preventDefault();
            shortcuts.onRefresh?.();
          }
          break;

        case 'escape':
          // Close any open modals or focus management
          if (shortcuts.onFocusSearch) {
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
            if (searchInput && document.activeElement === searchInput) {
              preventDefault();
              searchInput.blur();
            }
          }
          break;

        default:
          break;
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
