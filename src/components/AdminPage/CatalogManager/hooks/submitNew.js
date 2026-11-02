import { useCallback } from 'react';

export default function useSubmitNew({ drafts, onAdd, setDrafts }) {
  return useCallback(
    (type, event) => {
      event.preventDefault();
      onAdd(type, drafts[type]);
      setDrafts((current) => ({ ...current, [type]: '' }));
    },
    [drafts, onAdd, setDrafts]
  );
}
