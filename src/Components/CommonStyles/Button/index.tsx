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
          border: `1px solid ${theme.palette.primary.main}`,
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
      <Tooltip title={tooltip}>
        <div>
          <IconButton
            {...otherProps}
            sx={{
              height: "32px",
              width: "32px",
              "&:focus": {
                outline: "none",
              },
              borderRadius: isRound ? "50%" : "8px",
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
    <Tooltip title={tooltip}>
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
