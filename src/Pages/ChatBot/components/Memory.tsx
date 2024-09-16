import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useTheme } from "@mui/material";
import { Fragment } from "react/jsx-runtime";

const Memory = () => {
  //! State
  const theme = useTheme()

  //! Function

  //! Render
  return (
    <Fragment>
      <CommonStyles.Button
        sx={{
          background: theme.colors.custom.backgroundCard,
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,.04),0 0 1px 0 rgba(0,0,0,.08)",
          color: "unset",
        }}
        endIcon={<CommonIcons.KeyboardArrowDown />}
      >
        <CommonIcons.Psychology />
      </CommonStyles.Button>
    </Fragment>
  );
};


export default Memory;