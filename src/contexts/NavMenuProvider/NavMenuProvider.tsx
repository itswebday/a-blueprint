"use client";

import { scrollToTop } from "@/utils";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Navigation menu context type
type NavMenuContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

// Create context
const NavMenuContext = createContext<NavMenuContextType | undefined>(undefined);

type NavMenuProviderProps = {
  children: ReactNode;
};

export const NavMenuProvider = ({ children }: NavMenuProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Open navigation menu
  const open = () => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      setIsOpen(true);
    }
  };

  // Close navigation menu
  const close = () => {
    if (isOpen) {
      document.body.style.overflow = "";
      setIsOpen(false);
    }
  };

  // Toggle between open and close states
  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      if (window.scrollY > 0) {
        scrollToTop();
        setTimeout(() => {
          open();
        }, 100);
      } else {
        open();
      }
    }
  };

  // Close the navigation menu when the window is resized
  useEffect(() => {
    const closeAfterResize = () => {
      document.body.style.overflow = "";
      setIsOpen(false);
    };

    window.addEventListener("resize", closeAfterResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", closeAfterResize);
    };
  }, []);

  // Cleanup body overflow style on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Provide navigation menu context
  return (
    <NavMenuContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
      }}
    >
      {children}
    </NavMenuContext.Provider>
  );
};

// Hook to access navigation menu context
export const useNavMenu = () => {
  const context = useContext(NavMenuContext);

  if (!context) {
    throw new Error("useNavMenu must be used within a NavMenuProvider");
  }

  return context;
};
