import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";

interface IMuiButton {
  children: React.ReactNode;
  isIcon?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
  isRound?: boolean;
  tooltip?: string;
  hasBorder?: boolean;
}

function MuiButton(props: IMuiButton & ButtonProps) {
  //! State
  const {
    children,
    isIcon,
    isLoading,
    isActive,
    isRound = true,
    tooltip = "",
    hasBorder = true,
    ...otherProps
  } = props;
  const theme = useTheme();
  const styleActive = useMemo(() => {
    if (isActive) {
      return {
        border: `solid 1px ${theme.palette.primary.main} !important`,
        background: theme.colors.custom.colorActive,
      };
    }
    if (otherProps.variant === "outlined") {
      return {
        background: theme.colors.custom.backgroundSecondary,
        "&:hover": {
          border:
            otherProps.color !== "error"
              ? `1px solid ${theme.palette.primary.main}`
              : "1px solid #f44336",
        },
      };
    }
    if (otherProps.variant === "contained") {
      return {
        border: `none !important`,
        color: "#ffffff !important",
      };
    }
  }, [isActive, theme, otherProps.variant]);

  //! Function

  //! Render
  if (isIcon) {
    return (
      <Tooltip title={tooltip} placement="top-end">
        <div style={{ width: "fit-content" }}>
          <IconButton
            {...otherProps}
            sx={{
              height: "40px",
              width: "40px",
              padding: 0,
              "&:focus": {
                outline: "none",
              },
              borderRadius: isRound ? "50%" : "8px",
              border: hasBorder
                ? `solid 1px ${theme.colors.custom.borderColor}`
                : "none",
              ...props.sx,
            }}
          >
            {children}
          </IconButton>
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltip} placement="top-end">
      <div>
        <Button
          {...otherProps}
          sx={{
            padding: "6px 15px",
            borderRadius: "8px",
            textTransform: "none",
            height: "32px",
            fontWeight: 600,
            fontSize: "14px",
            "&:focus": {
              outline: "none",
            },
            color: theme.colors.custom.normalColorTypo,

            ...styleActive,
            ...props.sx,
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : children}
        </Button>
      </div>
    </Tooltip>
  );
}

export default MuiButton;
