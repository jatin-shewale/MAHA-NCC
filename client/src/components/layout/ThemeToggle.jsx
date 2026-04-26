import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass rounded-2xl p-3 text-slate-700 transition hover:-translate-y-0.5 dark:text-slate-200"
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </button>
  );
};
