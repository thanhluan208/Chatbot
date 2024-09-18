import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useGet, useSave } from "@/Stores/useStore";
import { useTheme } from "@mui/material";

const AnimationControl = () => {
  //! State
  const disabledCircle = useGet("DISABLE_CIRCLE");
  const save = useSave();
  const theme = useTheme();

  return (
    <CommonStyles.Button
      isIcon
      sx={{
        background: !disabledCircle
          ? theme.colors.custom.backgroundCardHover
          : theme.colors.custom.backgroundCard,
        borderRadius: "8px",
        padding: "12px",
        maxWidth: "unset",
        height: "fit-content",
        width: "fit-content",
      }}
      onClick={() => save("DISABLE_CIRCLE", !disabledCircle)}
    >
      <CommonIcons.Animation />
    </CommonStyles.Button>
  );
};

export default AnimationControl;
