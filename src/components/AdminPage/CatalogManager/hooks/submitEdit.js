import { useCallback } from 'react';

export default function useSubmitEdit({
  editing,
  editValue,
  onRename,
  setEditing,
}) {
  return useCallback(
    (event) => {
      event.preventDefault();

      if (!editing) return;

      onRename(editing.type, editing.value, editValue);
      setEditing(null);
    },
    [editing, editValue, onRename, setEditing]
  );
}
