import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import SectionItem from "./SectionItem";
import { useGet } from "@/Stores/useStore";
import { BotData } from "@/Hooks/Bot/useGetBotData";

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
  const botData: BotData = useGet("BOT_DATA");
  const knowledge_storage_ids = botData?.knowledge_storage_ids;

  //! Function

  //! Render
  return (
    <Box>
      <CommonStyles.CollapseArea
        sxContainer={{
          marginTop: "12px",
          "& .collapse-header": {
            marginBottom: "0",
          },
        }}
        label={
          <CommonStyles.Typography
            type="bold14"
            color={theme.colors.custom.normalColorTypo}
          >
            {title}
          </CommonStyles.Typography>
        }
      >
        <Box mt="6px" pl="12px">
          {knowledge_storage_ids &&
            items?.map((item) => {
              return (
                <SectionItem
                  title={item.title}
                  content={item.content}
                  key={item.title}
                  sectionTitle={title}
                  list={knowledge_storage_ids}
                />
              );
            })}
        </Box>
      </CommonStyles.CollapseArea>
    </Box>
  );
}

export default Section;
