import { Button, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import CenterBox from '@/Components/CommonStyles/Centerbox';
import {
  IcBaselineDiscord,
  IcOutlineTelegram,
  IcRoundStar,
  MaterialSymbolsGroups,
  PhChatTeardropDotsFill,
  PhMessengerLogoLight,
} from '@/Components/CommonIcons/Dashboard';

export function formatNumber(inputNumber: number): string | number {
  if (inputNumber < 1000) {
    return inputNumber;
  }
  if (inputNumber < 100000) {
    const tmp = Math.floor(inputNumber / 100);
    return `${Math.floor(tmp / 10)}.${tmp % 10}K`;
  }
  return '';
}

export interface BotRecord {
  id: number;
  botName: string;
  ava: string;
  author: {
    name: string;
    ava: string;
    tag: string;
  };
  description: string;
  viewNumber: number;
  favorNumber: number;
  chatNumber: number;
  isRecommended?: boolean;
  isDiscordSupport?: boolean;
  isMessSupport?: boolean;
  isTelegramSupport?: boolean;
  isFavor?: boolean;
}

interface Props {
  data: BotRecord[];
  loadMoreFn: (num: number) => void;
}
export default function DashboardBotList({ data, loadMoreFn }: Props) {
  //   const listContainer = useRef<null | HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<string>();
  const [itemNum, setItemNum] = useState<number>(1);
  const {
    palette: { mode },
  } = useTheme();

  //   const containerWidth = useMemo(() => )
  useEffect(() => {
    const handleOnResize = () => {
      console.log(window.screen.width);
      if (window.screen.width <= 500) {
        setContainerWidth('100%');
        setItemNum(1);
      } else {
        const tmp = Math.ceil(window.screen.width / 800);
        setContainerWidth(`calc((100% - ${tmp - 1}rem) /${tmp})`);
        setItemNum(tmp);
      }
    };
    handleOnResize();
    window.addEventListener('resize', handleOnResize);
    return () => {
      window.removeEventListener('resize', handleOnResize);
    };
  }, [containerWidth]);
  return (
    <CenterBox
      sx={{
        flexDirection: 'column',
        width: '100%',
        paddingX: '112px',
        '@media only screen and (max-width: 1000px)': {
          paddingX: '1rem',
          paddingY: '2rem',
        },
      }}
    >
      <CenterBox
        sx={{
          flexWrap: 'wrap',
          gap: '1rem',
          flexShrink: 'none',
          width: '100%',
          justifyContent: 'start',
        }}
      >
        {data.map((record, index) => (
          <CenterBox
            sx={{
              width: containerWidth,
              height: '300px',
              bgcolor: mode === 'dark' ? 'rgba(0,0,0,.2)' : 'white',
              borderRadius: '.5rem',
              padding: '20px',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0px 2px 4px 0px #1E1E1F0A',
            }}
            key={`bot-record-${index}`}
          >
            <CenterBox
              sx={{
                flex: 1,
                justifyContent: 'start',
                alignItems: 'start',
                width: '100%',
                gap: '16px',
              }}
            >
              <CenterBox
                sx={{
                  width: '62px',
                  height: '62px',
                  bgcolor: 'red',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  img: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  },
                }}
              >
                <img src={record.ava} />
              </CenterBox>
              <CenterBox
                sx={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignItems: 'start',
                  gap: '4px',
                }}
              >
                <CenterBox sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {record.botName}
                </CenterBox>
                <CenterBox
                  sx={{
                    width: '100%',
                    height: '16px',
                    justifyContent: 'start',
                    gap: '4px',
                  }}
                >
                  <CenterBox
                    sx={{
                      width: '16px',
                      height: '16px',
                      bgcolor: 'red',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      img: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      },
                    }}
                  >
                    <img src={record.author.ava} />
                  </CenterBox>
                  <CenterBox
                    sx={{
                      color:
                        mode === 'dark'
                          ? 'rgba(255,255,255,.5)'
                          : 'rgba(0,0,0,.5)',
                    }}
                  >
                    {record.author.name}
                  </CenterBox>
                  <CenterBox
                    sx={{
                      color:
                        mode === 'dark'
                          ? 'rgba(255,255,255,.5)'
                          : 'rgba(0,0,0,.5)',
                    }}
                  >
                    {record.author.tag}
                  </CenterBox>
                </CenterBox>
                <CenterBox sx={{ overflow: 'hiddent' }}>
                  {record.description}
                </CenterBox>
              </CenterBox>
            </CenterBox>
            <CenterBox
              sx={{
                width: '100%',
                height: '2px',
                bgcolor:
                  mode === 'dark' ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.5)',
              }}
            />
            <CenterBox
              sx={{
                display: 'flex',
                height: '20px',
                width: '100%',
                gap: '4px',
                '*': {
                  color:
                    mode === 'dark' ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.5)',
                },
                justifyContent: 'start',
              }}
            >
              <CenterBox
                sx={{ height: '100%', aspectRatio: '1/1', width: 'auto' }}
              >
                <MaterialSymbolsGroups width={'100%'} height={'100%'} />
              </CenterBox>
              <CenterBox>{formatNumber(record.viewNumber)}</CenterBox>

              <CenterBox
                sx={{
                  height: '100%',
                  aspectRatio: '1/1',
                  width: 'auto',
                  ml: '.5rem',
                }}
              >
                <PhChatTeardropDotsFill width={'100%'} height={'100%'} />
              </CenterBox>
              <CenterBox>{formatNumber(record.viewNumber)}</CenterBox>

              <CenterBox
                sx={{
                  height: '100%',
                  aspectRatio: '1/1',
                  width: 'auto',
                  ml: '.5rem',
                }}
              >
                <IcRoundStar width={'100%'} height={'100%'} />
              </CenterBox>
              <CenterBox>{formatNumber(record.viewNumber)}</CenterBox>
              <CenterBox flex={1} />
              {record.isDiscordSupport && (
                <CenterBox
                  sx={{
                    height: '100%',
                    aspectRatio: '1/1',
                    width: 'auto',
                  }}
                >
                  <IcBaselineDiscord width={'100%'} height={'100%'} />
                </CenterBox>
              )}
              {record.isTelegramSupport && (
                <CenterBox
                  sx={{
                    height: '100%',
                    aspectRatio: '1/1',
                    width: 'auto',
                  }}
                >
                  <IcOutlineTelegram width={'100%'} height={'100%'} />
                </CenterBox>
              )}
              {record.isMessSupport && (
                <CenterBox
                  sx={{
                    height: '100%',
                    aspectRatio: '1/1',
                    width: 'auto',
                  }}
                >
                  <PhMessengerLogoLight width={'100%'} height={'100%'} />
                </CenterBox>
              )}
            </CenterBox>
          </CenterBox>
        ))}
      </CenterBox>
      <CenterBox className="width">
        <Button
          id="loadmore-btn"
          sx={{
            display: 'flex',
            padding: '3px 1rem',
            fontSize: '14px',
            mt: '2rem',
            bgcolor: 'white',
            textTransform: 'none',
            color: 'black',
            height: '32px',
            borderRadius: '6px',
            flexShrink: 0,
            boxSizing: 'border-box',
            boxShadow: '0px 2px 4px 0px #1E1E1F0A',
          }}
          onClick={(e) => {
            loadMoreFn(itemNum * 6);
            (e.target as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Load more
        </Button>
      </CenterBox>
    </CenterBox>
  );
}
