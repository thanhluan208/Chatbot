import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useGet, useSave } from "@/Stores/useStore";
import { useTheme } from "@mui/material";

const AnimationControl = () => {
  //! State
  const disabledCircle = useGet("DISABLE_CIRCLE");
  const save = useSave();
  const theme = useTheme()

  return (
    <CommonStyles.Button
      isIcon
      className="iconBtn"
      sx={{
        background: disabledCircle ? 'transparent !important' : theme.colors.custom.backgroundCard
      }}
      onClick={() => save("DISABLE_CIRCLE", !disabledCircle)}
      tooltip={disabledCircle ? "Enable animation" : "Disable animation"}
    >
      <CommonIcons.Animation />
    </CommonStyles.Button>
  );
};

export default AnimationControl;
