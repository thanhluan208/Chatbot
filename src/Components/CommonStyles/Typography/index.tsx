import { useTheme } from "@mui/material";
import TypographyMui, { TypographyProps } from "@mui/material/Typography";
import { useMemo } from "react";

interface ITypography {
  type?: string;
  color?: string;
  truncate?: boolean;
}

const Typography = (props: ITypography & TypographyProps) => {
  //! State
  const { type = "normal14", sx,truncate, ...restProps } = props;
  const theme = useTheme()
  const sxCustomize = useMemo(() => {
    const styles = new Map();

    styles.set("normal10", {
      fontSize: "10px",
      fontWeight: 400,
    });

    styles.set("semiBold10", {
      fontSize: "10px",
      fontWeight: 500,
    });

    styles.set("bold12", {
      fontSize: "12px",
      fontWeight: 600,
    });

    styles.set("semiBold12", {
      fontSize: "12px",
      fontWeight: 500,
    });

    styles.set("semiBold14", {
      fontSize: "14px",
      fontWeight: 500,
    });

    styles.set("normal14", {
      fontSize: "14px",
      fontWeight: 400,
    });

    styles.set("normal12", {
      fontSize: "12px",
      fontWeight: 400,
    });
    styles.set("normal20", {
      fontSize: "20px",
      fontWeight: 400,
    });

    styles.set("bold14", {
      fontSize: "14px",
      fontWeight: 600,
    });

    styles.set("bold18", {
      fontSize: "18px",
      fontWeight: 600,
    });

    styles.set("bold20", {
      fontSize: "20px",
      fontWeight: 600,
    });

    styles.set("semiBold14", {
      fontSize: "14px",
      fontWeight: 500,
    });

    styles.set("normal18", {
      fontSize: "18px",
      fontWeight: 400,
    });

    styles.set("semiBold18", {
      fontSize: "18px",
      fontWeight: 500,
    });

    styles.set("semiBold16", {
      fontSize: "16px",
      fontWeight: 500,
    });

    styles.set("semiBold20", {
      fontSize: "20px",
      fontWeight: 500,
    });
    styles.set("semiBold24", {
      fontSize: "24px",
      fontWeight: 500,
    });
    styles.set("semiBold28", {
      fontSize: "28px",
      fontWeight: 500,
    });

    styles.set("bold56", {
      fontSize: "56px",
      fontWeight: 600,
    });
    styles.set("bold32", {
      fontSize: "32px",
      fontWeight: 600,
    });
    styles.set("semiBold32", {
      fontSize: "32px",
      fontWeight: 500,
    });
    styles.set("bold40", {
      fontSize: "40px",
      fontWeight: 500,
    });
    const returnedStyle = {
      ...styles.get(type)
    }
     
    if(truncate) {
      returnedStyle["overflow"] = "hidden";
      returnedStyle["textOverflow"] = "ellipsis";
      returnedStyle["whiteSpace"] = "nowrap";
    }

    return returnedStyle;
  }, [type,truncate]);

  //! Render
  return (
    <TypographyMui
      sx={{
        ...sxCustomize,
        ...sx,
        color: props.color ?? theme.colors.custom.normalColorTypo,
      }}
      {...restProps}
    >
      {props.children}
    </TypographyMui>
  );
};

export default Typography;
