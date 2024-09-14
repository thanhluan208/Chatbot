import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { newConversation } from "@/Constants/api";
import cachedKeys from "@/Constants/cachedKeys";
import useGetListConversation from "@/Hooks/Bot/useGetListConversation";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { useSave } from "@/Stores/useStore";
import { Box, useTheme } from "@mui/material";
import { isArray, isObject } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteConversationButton from "./DeleteConversationButton";
import { AxiosResponse } from "axios";

export interface CreateNewConversation {
  status_code: number;
  message: string;
  conversation_id: string;
}

const LeftSide = ({ setOpenConversation }: { setOpenConversation?: any }) => {
  //! State
  const theme = useTheme();
  const params = useParams();
  const botId = params.botId as string;
  const { data, isLoading, refetch } = useGetListConversation(botId, !!botId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const save = useSave();

  const query = new URLSearchParams(window.location.search);

  //! Function
  const handleClickConversation = (conversationId: string) => {
    if (query.get("conversation") === conversationId || loading) return;
    const isOwner = query.get("isOwner");
    navigate(
      window.location.pathname +
        `?isOwner=${isOwner}&conversation=${conversationId}`
    );
  };

  const handleNewConversation = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<CreateNewConversation> =
        await httpServices.post(newConversation, {
          bot_id: botId,
          user_id: userId,
        });

      refetch && (await refetch());

      if (response.data.status_code === 200 && response.data.conversation_id) {
        handleClickConversation(response.data.conversation_id);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create new conversation");
      setLoading(false);
    }
  };

  useEffect(() => {
    save(cachedKeys.REFETCH_CONVERSATION, refetch);
  }, [save]);

  //! Render

  return (
    <Box
      sx={{
        [theme.breakpoints.down("md")]: {
          "& .main-scrollbar": {
            maxHeight: "calc(100vh) !important",
            minHeight: "calc(100vh) !important",
          },
        },
      }}
    >
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <PerfectScrollbar
        className="main-scrollbar"
        style={{
          background: "#f9f9f9",
          padding: "24px 0",
          maxHeight: "calc(100vh - 74px)",
          minHeight: "calc(100vh - 74px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            padding: "0 24px",
            button: {
              borderRadius: "8px",
            },
          }}
        >
          <CommonStyles.Button
            isIcon
            onClick={() => {
              setOpenConversation && setOpenConversation(false);
            }}
          >
            <CommonIcons.ViewSidebar />
          </CommonStyles.Button>

          <CommonStyles.Button
            disabled={loading}
            isIcon
            onClick={handleNewConversation}
          >
            <CommonIcons.RateReview />
          </CommonStyles.Button>
        </Box>

        {isObject(data) &&
          Object.values(data).map((item) => {
            return (
              <Box
                key={item.date}
                sx={{
                  marginTop: "50px",
                }}
              >
                <CommonStyles.Typography
                  type="semiBold12"
                  sx={{
                    padding: "0 16px",
                  }}
                >
                  {moment(item.date).format("DD/MM/YYYY")}
                </CommonStyles.Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "12px",
                  }}
                >
                  {isArray(item?.conversations) &&
                    item?.conversations.map((conv) => {
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            gap: "8px",
                            padding: "0 24px",
                            alignItems: "center",
                            "&:hover": {
                              "& .delete-button": {
                                opacity: 1,
                                width: "32px !important",
                                padding: "8px !important",
                              },
                            },
                          }}
                        >
                          <CommonStyles.Button
                            variant="outlined"
                            disabled={loading}
                            sx={{
                              border: "1px solid #E0E0E0",
                              color: "unset",
                              flexDirection: "column",
                              maxHeight: "unset",
                              height: "fit-content",
                              alignItems: "flex-start",
                            }}
                            onClick={() => {
                              if (loading) return;
                              handleClickConversation(conv.id);
                            }}
                          >
                            <CommonStyles.Typography
                              type="semiBold14"
                              sx={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {`Conversation ${conv.id}`}
                            </CommonStyles.Typography>
                            <CommonStyles.Typography type="normal12">
                              {moment(conv.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </CommonStyles.Typography>
                          </CommonStyles.Button>
                          <DeleteConversationButton id={conv.id} />
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            );
          })}
      </PerfectScrollbar>
    </Box>
  );
};

export default LeftSide;
