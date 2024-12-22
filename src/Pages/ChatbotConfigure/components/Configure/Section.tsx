import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import SectionKnowledgeItem from "./SectionKnowledgeItem";
import { useGet } from "@/Stores/useStore";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import { ConfigureEnum, ConfigureItem } from "@/Constants/options";
import SectionChatExperience from "./SectionChatExperience";

interface ISection {
  title: string;
  items: ConfigureItem[];
  type: ConfigureEnum;
}

function Section(props: ISection) {
  //! State
  const { title, items, type } = props;
  const theme: any = useTheme();
  const botData: BotData = useGet("BOT_DATA");
  const knowledge_storage_ids = botData?.knowledge_storage_ids;

  //! Function
  const renderSectionItem = (item: ConfigureItem, type: ConfigureEnum) => {
    switch (type) {
      case ConfigureEnum.Knowledge:
        return (
          <SectionKnowledgeItem
            title={item.title}
            content={item.content}
            key={item.title}
            sectionTitle={title}
            list={knowledge_storage_ids}
          />
        );

      case ConfigureEnum.ChatExperience:
        return (
          <SectionChatExperience
            title={item.title}
            content={item.content}
            key={item.title}
            sectionTitle={title}
          />
        );
      default:
        return null;
    }
  };

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
          {items?.map((item) => {
            return renderSectionItem(item, type);
          })}
        </Box>
      </CommonStyles.CollapseArea>
    </Box>
  );
}

export default Section;
