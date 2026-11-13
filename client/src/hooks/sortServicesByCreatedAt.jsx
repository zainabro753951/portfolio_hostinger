const sortServicesByCreatedAt = (services = []) => {
  if (!Array.isArray(services)) return [];

  return [...services].sort((a, b) => {
    const dateA = new Date(a?.createdAt).getTime();
    const dateB = new Date(b?.createdAt).getTime();

    // Invalid dates go to the end
    if (!Number.isFinite(dateA)) return 1;
    if (!Number.isFinite(dateB)) return -1;

    // Oldest first
    return dateA - dateB;
  });
};

export default sortServicesByCreatedAt;
