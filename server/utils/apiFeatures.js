export const buildSearchQuery = (search, fields = []) => {
  if (!search || !fields.length) return {};
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: search, $options: "i" }
    }))
  };
};

export const buildSortQuery = (sortBy = "createdAt", order = "desc") => ({
  [sortBy]: order === "asc" ? 1 : -1
});
