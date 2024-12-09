import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ReactNode, useEffect, useMemo, useState } from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";
import { useTheme } from "@mui/material";
import { capitalize } from "lodash";
import CommonStyles from "../CommonStyles";

type Tab = {
  id: number;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

interface DirectionAwareTabsRef {
  setActiveTab: (tabId: number) => void;
  setDirection: (direction: number) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  handleTabClick: (tabId: number) => void;
}

interface OgImageSectionProps {
  tabs: Tab[];
  className?: string;
  rounded?: string;
  onChange?: () => void;
  innerRef?: React.MutableRefObject<DirectionAwareTabsRef | null>;
}

function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  onChange,
  innerRef,
}: OgImageSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ref, bounds] = useMeasure();
  const theme = useTheme();

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    return activeTabContent || null;
  }, [activeTab, tabs]);

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1;
      setDirection(newDirection);
      setActiveTab(newTabId);
      onChange ? onChange() : null;
    }
  };

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
    }),
    active: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
    }),
  };

  useEffect(() => {
    if (innerRef) {
      innerRef.current = {
        setActiveTab,
        setDirection,
        setIsAnimating,
        handleTabClick,
      };
    }
  }, []);

  return (
    <div className=" flex flex-col items-center w-full px-4">
      <div
        className={cn(
          "flex w-full space-x-1  px-[3px] py-[3.2px] shadow-inner-shadow",
          className,
          rounded
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "relative rounded-md justify-center px-3.5 py-1.5 text-xs sm:text-sm font-medium  transition focus-visible:outline-1 focus-visible:ring-1  focus-visible:outline-none flex flex-1 gap-2 items-center ",
              tab.disabled && "opacity-50"
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute rounded-md inset-0 z-10  mix-blend-difference shadow-inner-shadow  "
                style={{
                  background: theme.palette.primary.main,
                }}
                transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
              />
            )}

            <CommonStyles.Typography type="semiBold16" className="z-50">
              {capitalize(tab.label)}
            </CommonStyles.Typography>
          </button>
        ))}
      </div>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
        <motion.div
          className="relative mx-auto w-full h-full overflow-hidden"
          initial={false}
          animate={{ height: bounds.height }}
        >
          <div className="p-1" ref={ref}>
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  );
}
export { DirectionAwareTabs };
