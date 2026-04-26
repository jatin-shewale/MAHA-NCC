export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium"
  }).format(new Date(value));

export const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value || 0);

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
