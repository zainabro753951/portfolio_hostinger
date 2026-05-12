import { useContext } from 'react';
import DeleteEntryContext from './DeleteEntryContextCore';

// ✅ Custom hook - alag file, Fast Refresh friendly
export const useDeleteEntryContext = () => {
  const context = useContext(DeleteEntryContext);
  if (!context) {
    throw new Error('useDeleteEntryContext must be used within DeleteEntryProvider');
  }
  return context;
};

export default useDeleteEntryContext;
