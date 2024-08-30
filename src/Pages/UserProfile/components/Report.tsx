import CommonIcons from "../../../Components/CommonIcons";
import CommonStyles from "../../../Components/CommonStyles";

const Report = () => {
  return (
    <CommonStyles.Button
      isIcon
      sx={{
        height: "40px",
        maxHeight: "unset",
        width: "40px",
        borderRadius: "8px",
      }}
    >
      <CommonIcons.Report />
    </CommonStyles.Button>
  );
};


export default Report;