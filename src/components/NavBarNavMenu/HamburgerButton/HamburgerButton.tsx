"use client";

import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useNavMenu } from "@/contexts";
import HamburgerDash from "./HamburgerDash";

type HamburgerButtonProps = {
  className?: string;
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ className }) => {
  const navMenu = useNavMenu();

  return (
    <motion.button
      className={twMerge(
        "flex flex-col justify-center items-center gap-1.5",
        "w-12 h-12 rounded-xl bg-primary-purple/10",
        "hover:bg-primary-purple/20 transition-colors duration-300",
        className,
      )}
      onClick={navMenu.toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hamburger dashes */}
      <HamburgerDash dashIndex={0} />
      <HamburgerDash dashIndex={1} />
      <HamburgerDash dashIndex={2} />
    </motion.button>
  );
};

export default HamburgerButton;
