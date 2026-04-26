import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const CountUp = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString("en-IN"));

  useEffect(() => {
    const controls = animate(count, Number(value) || 0, { duration: 1 });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

export default CountUp;
