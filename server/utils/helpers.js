import { nanoid } from "nanoid";

export const buildCadetId = () => `NCC-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;

export const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});

export const paginate = ({ page = 1, limit = 10 }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit
  };
};
