import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDeleteEntry } from '../Queries/DeleteEntryQuery';
import { clearViewMessage, deleteMessage } from '../features/messageSlice';
import { glassToast } from '../pages/admin/Components/ToastMessage';
import DeleteEntryContext from './DeleteEntryContextCore'; // ✅ Context import

// ✅ Sirf Provider component - Default export
const DeleteEntryProvider = ({ children }) => {
  const [route, setRoute] = useState('');
  const [queryKey, setQueryKey] = useState([]);
  const [ids, setIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const { mutate, isPending, isSuccess, isError, data, error, reset } = useDeleteEntry(queryKey);

  const onClose = () => {
    setIsOpen(false);
    reset();
    setTimeout(() => {
      setRoute('');
      setIds([]);
      setQueryKey([]);
    }, 300);
  };

  const onDelete = () => {
    if (!route) {
      glassToast('Invalid delete request', 'error');
      return;
    }
    if (ids.length === 0 && !route.match(/\/\d+$/)) {
      glassToast('Invalid delete request', 'error');
      return;
    }
    mutate({ route, ids });
  };

  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message || 'Deleted successfully', 'success');
      dispatch(deleteMessage(ids));
      dispatch(clearViewMessage());
      onClose();
    }
    if (isError) {
      console.error('Delete error:', error);
      glassToast(
        error?.response?.data?.message || error?.message || 'Error deleting entry',
        'error'
      );
    }
  }, [isSuccess, isError, data, error, ids, dispatch]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const value = {
    setRoute,
    setIds,
    setQueryKey,
    setIsOpen,
    isOpen,
    onDelete,
    onClose,
    isPending,
    confirmDelete: (route, ids, queryKey = 'contactMessages') => {
      setRoute(route);
      setIds(Array.isArray(ids) ? ids : [ids]);
      setQueryKey(queryKey);
      setIsOpen(true);
    },
  };

  return <DeleteEntryContext.Provider value={value}>{children}</DeleteEntryContext.Provider>;
};

export default DeleteEntryProvider;
