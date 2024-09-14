import { Box, useTheme } from "@mui/material";
import ConfigurationItem, { ConfigurationItemEnum } from "./ConfigurationItem";
import PerfectScrollbar from "react-perfect-scrollbar";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import { formatNumber, mockDescription } from "@/Helpers";
import { Fragment, useState } from "react";
import ViewmoreConfig from "./ViewmoreConfig";
import AddComment from "./AddComment";
import Community from "./Community/Community";
import CommunityDetail from "./Community/CommunityDetail";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

const Description = ({ text }: { text: string }) => {
  //! State
  const [isShowMore, setIsShowMore] = useState(false);
  //! Function

  //! Render

  return (
    <CommonStyles.Typography type="normal14">
      {isShowMore ? text : text.slice(0, 100) + "..."}
      <CommonStyles.Typography
        type="semiBold12"
        component="span"
        sx={{
          cursor: "pointer",
          marginLeft: "4px",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
        onClick={() => setIsShowMore(!isShowMore)}
      >
        {isShowMore ? "Show less" : "Show more"}
      </CommonStyles.Typography>
    </CommonStyles.Typography>
  );
};

interface RightSideProps {
  user: number;
  conversation: number;
  like: number;
  configuration: {
    model: string;
    items?: ConfigurationItemEnum[];
  };
}

export const RightSide = ({
  user,
  conversation,
  like,
  configuration,
}: RightSideProps) => {
  //! State
  const save = useSave()

  const queryParams = new URLSearchParams(location.search);

  const community = queryParams.get("community");

  const theme = useTheme();

  //! Function

  //! Render
  return (
    <Box
      sx={{
        [theme.breakpoints.down("lg")]: {
          "& .main-scrollbar": {
            maxHeight: "calc(100vh) !important",
            minHeight: "calc(100vh) !important",
          },
        },
      }}
    >
      <PerfectScrollbar
        className="main-scrollbar"
        style={{
          background: "#f9f9f9",
          padding: "24px",
          maxHeight: "calc(100vh - 74px)",
          minHeight: "calc(100vh - 74px)",
        }}
      >
        {community ? (
          <CommunityDetail />
        ) : (
          <Fragment>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                    border: "1px solid #0607090a",
                    borderRadius: "8px",
                    svg: {
                      width: 12,
                      height: 12,
                      border: "1px solid #0607090a",
                      borderRadius: "8px",
                    },
                  }}
                >
                  <CommonStyles.Button
                    sx={{
                      color: "unset",
                      padding: "4px 10px",
                      gap: "8px",
                      minWidth: "unset",
                      borderRadius: "8px",
                    }}
                  >
                    <CommonIcons.ThumbUp />
                    <CommonStyles.Typography type="normal12">
                      {like}
                    </CommonStyles.Typography>
                  </CommonStyles.Button>
                  <Box
                    sx={{
                      height: "12px",
                      width: "1px",
                      background: "#0607091a",
                      margin: "0 4px",
                    }}
                  />
                  <CommonStyles.Button
                    sx={{
                      color: "unset",
                      padding: "4px 10px",
                      gap: "4px",
                      minWidth: "unset",
                      borderRadius: "8px",
                    }}
                  >
                    <CommonIcons.ThumbDown />
                  </CommonStyles.Button>
                </Box>
                <Box
                  sx={{
                    height: "24px",
                    width: "1px",
                    background: "#0607091a",
                    margin: "0 12px",
                  }}
                />
                <Box sx={{ display: "flex", gap: "4px" }}>
                  <CommonStyles.Typography type="semiBold20">
                    {formatNumber(user)}
                  </CommonStyles.Typography>
                  <CommonStyles.Typography
                    type="normal12"
                    sx={{
                      padding: "11px 0 4px",
                    }}
                  >
                    users
                  </CommonStyles.Typography>
                </Box>
                <Box
                  sx={{
                    height: "24px",
                    width: "1px",
                    background: "#0607091a",
                    margin: "0 12px",
                  }}
                />
                <Box sx={{ display: "flex", gap: "4px" }}>
                  <CommonStyles.Typography type="semiBold20">
                    {formatNumber(conversation)}
                  </CommonStyles.Typography>
                  <CommonStyles.Typography
                    type="normal12"
                    sx={{
                      padding: "11px 0 4px",
                    }}
                  >
                    conversations
                  </CommonStyles.Typography>
                </Box>
              </Box>
              <CommonStyles.Button
                isIcon
                onClick={() => {
                  save(cachedKeys.OPEN_DRAWER, false)
                }}
              >
                <CommonIcons.Close />
              </CommonStyles.Button>
            </Box>
            <Box
              sx={{
                marginTop: "24px",
              }}
            >
              <Description text={mockDescription()} />
            </Box>
            <Box
              sx={{
                marginTop: "24px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CommonStyles.Typography type="semiBold16">
                  Configuration items
                </CommonStyles.Typography>
                <ViewmoreConfig />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-3.5.png"
                    style={{
                      width: 16,
                      height: 16,
                    }}
                  />
                  <CommonStyles.Typography>
                    {"GPT-3.5 (16K)"}
                  </CommonStyles.Typography>
                </Box>
                <Box
                  sx={{
                    height: "12px",
                    width: "1px",
                    background: "#0607091a",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  {(configuration.items ?? []).map((item, index) => {
                    return (
                      <ConfigurationItem key={`${item}-${index}`} type={item} />
                    );
                  })}
                </Box>
              </Box>

              <CommonStyles.Typography
                type="semiBold16"
                sx={{
                  marginTop: "24px",
                }}
              >
                Open in
              </CommonStyles.Typography>

              <Box
                sx={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    svg: {
                      width: 14,
                      height: 14,
                    },
                  }}
                >
                  <CommonStyles.Typography type="semiBold16">
                    Community
                  </CommonStyles.Typography>
                  <CommonStyles.Button
                    sx={{
                      padding: "5px 5px 0",
                      width: "24px",
                      height: "24px",
                      minWidth: "unset",
                      color: "#060709",
                      borderRadius: "8px",
                    }}
                  >
                    <CommonIcons.Refresh />
                  </CommonStyles.Button>
                </Box>
                <AddComment />
              </Box>
              <Community />
            </Box>
          </Fragment>
        )}
      </PerfectScrollbar>
    </Box>
  );
};
