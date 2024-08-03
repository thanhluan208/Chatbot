import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import SectionItem from "./SectionItem";

interface ISection {
  title: string;
  items: {
    name: string;
    title: string;
    content: string;
  }[];
}

function Section(props: ISection) {
  //! State
  const { title, items } = props;
  const theme = useTheme();
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
              name={item.name}
              title={item.title}
              content={item.content}
              key={item.name}
              sectionTitle={title}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default Section;
