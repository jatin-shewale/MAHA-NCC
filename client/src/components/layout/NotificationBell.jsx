import { useCallback, useState } from "react";
import { FiBell } from "react-icons/fi";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { usePolling } from "../../hooks/usePolling";

export const NotificationBell = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications?limit=20");
      const unread = data.data.filter(
        (item) => !item.readBy?.some((entry) => (entry.user?._id || entry.user)?.toString?.() === user?.id?.toString?.())
      );
      setCount(unread.length);
    } catch {
      setCount(0);
    }
  }, [user?.id]);

  usePolling(fetchNotifications, 20000, true);

  return (
    <div className="relative">
      <div className="glass rounded-2xl p-3 text-slate-700 dark:text-slate-200">
        <FiBell />
      </div>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </div>
  );
};
