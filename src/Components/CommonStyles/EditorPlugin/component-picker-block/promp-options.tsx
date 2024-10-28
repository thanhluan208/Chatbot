import { useTheme } from "@mui/material";
import { memo } from "react";
import CommonStyles from "../..";

type PromptMenuItemMenuItemProps = {
  icon: JSX.Element;
  title: string;
  disabled?: boolean;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  setRefElement?: (element: HTMLDivElement) => void;
};
export const PromptMenuItem = memo(
  ({
    icon,
    title,
    disabled,
    isSelected,
    onClick,
    onMouseEnter,
    setRefElement,
  }: PromptMenuItemMenuItemProps) => {
    const theme = useTheme();
    return (
      <div
        className={`
        flex items-center px-3 h-6 cursor-pointer  rounded-md
        ${isSelected && !disabled && ""}
        ${disabled ? "cursor-not-allowed opacity-30" : " cursor-pointer"}
      `}
        style={{
          background: theme.colors.custom.background,
        }}
        tabIndex={-1}
        ref={setRefElement}
        onMouseEnter={() => {
          if (disabled) return;
          onMouseEnter();
        }}
        onClick={() => {
          if (disabled) return;
          onClick();
        }}
      >
        {icon}
        <CommonStyles.Typography  sx={{marginLeft:'4px'}} type="semiBold16">
          {title}
        </CommonStyles.Typography>
      </div>
    );
  }
);
PromptMenuItem.displayName = "PromptMenuItem";
