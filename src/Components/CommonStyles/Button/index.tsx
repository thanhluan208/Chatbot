import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";

interface IMuiButton {
  children: React.ReactNode;
  isIcon?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
  isRound?:boolean
}

function MuiButton(props: IMuiButton & ButtonProps) {
  //! State
  const { children, isIcon, isLoading, isActive,isRound=true, ...otherProps } = props;
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
        border: `none !important`,
        background: theme.colors.custom.backgroundSecondary,
      };
    }
    if(otherProps.variant === 'contained') {
      return {
        color:"#ffffff !important"
      }
    }
  }, [isActive, theme, otherProps.variant]);

  //! Function

  //! Render
  if (isIcon) {
    return (
      <IconButton
        {...otherProps}
        sx={{
          height: "32px",
          width: "32px",
          "&:focus": {
            outline: "none",
          },
          borderRadius: isRound?'50%':'8px',
          ...props.sx,
        }}
      >
        {children}
      </IconButton>
    );
  }

  return (
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
        "&:hover": {
          border: `1px solid ${theme.palette.primary.main}`
        },
        ...styleActive,
        ...props.sx,
      }}
    >
      {isLoading ? <CircularProgress size={24} /> : children}
    </Button>
  );
}

export default MuiButton;
