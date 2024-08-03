import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import SectionItem from "./SectionItem";

interface ISection {
  title: string;
  items: {
    title: string;
    content: string;
  }[];
}

function Section(props: ISection) {
  //! State
  const { title, items } = props;
  const theme: any = useTheme();
  //! Function

  //! Render
  return (
    <Box mb="16px">
      <CommonStyles.Typography
        type="bold14"
        color={theme.colors.custom.colorDisabledTypo}
      >
        {title}
      </CommonStyles.Typography>

      <Box mt="6px">
        {items?.map((item) => {
          return (
            <SectionItem
              title={item.title}
              content={item.content}
              key={item.title}
              sectionTitle={title}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default Section;
