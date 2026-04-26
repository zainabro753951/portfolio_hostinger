import React, { createContext, useContext, useEffect, useState } from "react";
import { useDeleteEntry } from "../Queries/DeleteEntryQuery";
import { glassToast } from "../pages/admin/Components/ToastMessage";
import { deleteMessage, clearViewMessage } from "../features/messageSlice";
import { useDispatch } from "react-redux";

export const DeleteEntryContext = createContext();
export const useDeleteEntryContext = () => useContext(DeleteEntryContext);

const DeleteEntry = ({ children }) => {
  const [route, setRoute] = useState("");
  const [queryKey, setQueryKey] = useState([]);
  const [ids, setIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const { mutate, isPending, isSuccess, isError, data, error, reset } =
    useDeleteEntry(queryKey);

  const onClose = () => {
    setIsOpen(false);

    // ✅ Sabse pehle mutation state reset karein
    reset();

    // Small delay taake animation complete ho
    setTimeout(() => {
      setRoute("");
      setIds([]);
      setQueryKey([]);
    }, 300);
  };

  const onDelete = () => {
    // Check: route honi chahiye, aur ya to ids hon ya route mein ID already ho
    if (!route) {
      glassToast("Invalid delete request", "error");
      return;
    }

    // Multiple delete: ids array mein values honi chahiye
    if (ids.length === 0 && !route.match(/\/\d+$/)) {
      // Optional: check if route has ID param
      glassToast("Invalid delete request", "error");
      return;
    }

    console.log(route);

    mutate({ route, ids });
  };

  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message || "Deleted successfully", "success");

      // Redux state update
      dispatch(deleteMessage(ids));

      // Check if viewMessage is in deleted IDs
      dispatch(clearViewMessage());

      onClose();
    }

    if (isError) {
      console.error("Delete error:", error);
      glassToast(
        error?.response?.data?.message ||
          error?.message ||
          "Error deleting entry",
        "error",
      );
    }
  }, [isSuccess, isError, data, error, ids, dispatch]);

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
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
    // Helper method
    confirmDelete: (route, ids, queryKey = "contactMessages") => {
      setRoute(route);
      setIds(Array.isArray(ids) ? ids : [ids]);
      setQueryKey(queryKey);
      setIsOpen(true);
    },
  };

  return (
    <DeleteEntryContext.Provider value={value}>
      {children}
    </DeleteEntryContext.Provider>
  );
};

export default DeleteEntry;
