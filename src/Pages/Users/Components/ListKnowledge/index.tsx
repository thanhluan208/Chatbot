import useGetListFolderKnowledge from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import { KnowledgeFilter } from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeListDialog";
import { IKnowledgeFolder } from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeFolder";
import KnowledgeFolder from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeFolder";
import { Fragment } from "react/jsx-runtime";
import { Box, useTheme } from "@mui/material";
import { isEmpty } from "lodash";
import Empty from "../ListBot/components/Empty";
import EmptyCard from "../ListBot/components/EmptyCard";
import CommonStyles from "@/Components/CommonStyles";
import CreateKnowledgeButton from "../CreateKnowledgeButton";
import { useEffect } from "react";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { useTranslation } from "react-i18next";

const filters = {
  visual_option: KnowledgeFilter.Shared,
  search_input: "",
};

const ListKnowledge = () => {
  //Translation
  const { t } = useTranslation("store");

  //! State
  const { data, isLoading, refetch } = useGetListFolderKnowledge(filters);
  const theme = useTheme();
  const save = useSave();

  //! Function
  useEffect(() => {
    save(cachedKeys.REFETCH_FOLDER_KNOWLEDGE, refetch);

    return () => {
      save(cachedKeys.REFETCH_FOLDER_KNOWLEDGE, null);
    };
  }, [refetch]);

  useEffect(() => {
    save(cachedKeys.LOADING_APP, isLoading);

    return () => {
      save(cachedKeys.LOADING_APP, false);
    }
  }, [isLoading]);


  //! Render
  if (isEmpty(data)) {
    return (
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Empty />
          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <EmptyCard />
          </Box>
        </Box>
        <CommonStyles.Typography type="semiBold20" mt={3}>
          {t("personal.work.noResultFound")}
        </CommonStyles.Typography>
        <CommonStyles.Typography
          mt={1}
          mb={3}
          sx={{
            color: theme.colors.custom.normalColorTypo,
          }}
        >
          {t("personal.work.knowledge.noResultLabel")}
        </CommonStyles.Typography>

        <CreateKnowledgeButton />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1600px",
        margin: "auto",
      }}
    >
      {data?.map((item: IKnowledgeFolder) => {
        return (
          <Fragment key={item.id}>
            <KnowledgeFolder
              id={item.id}
              title={item.title}
              description={item.description}
              size={item.size}
              quantity={item.quantity}
              createdAt={item.createdAt}
              sharingWithBots={item.sharingWithBots}
              owner_id={item.owner_id}
              permission_level={item.permission_level}
              avatar={item.avatar}
            />
          </Fragment>
        );
      })}
    </Box>
  );
};

export default ListKnowledge;
