import CenterBox from '@/Components/CommonStyles/Centerbox';
import { Telegram } from '@mui/icons-material';
import { Button, iconButtonClasses, Typography, useTheme } from '@mui/material';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';

export interface TagRecord {
  title: string;
  icon?: ReactNode;
  link: string;
}
const tagList: TagRecord[] = [
  {
    title: 'Discord',
    link: '',
    icon: <DiscordLogoIcon />,
  },
  {
    title: 'Telegram',
    link: '',
    icon: <Telegram />,
  },
  {
    title: '',
    link: '',
    icon: <DiscordLogoIcon />,
  },
  {
    title: '',
    link: '',
    icon: <DiscordLogoIcon />,
  },
];
export default function QuickTagSection() {
  const {
    palette: { mode },
  } = useTheme();

  return (
    <CenterBox
      sx={{
        display: 'flex',
        paddingX: '2rem',
        paddingY: '.5rem',
        width: '100%',
        gap: '.5rem',
        justifyContent: 'start',
        button: {
          bgcolor: '',
          outline: 'none !important',
          flex: 1,
          textTransform: 'none',
          border: `2px solid ${mode === 'dark' ? 'white' : 'black'}`,
          display: 'flex',
          gap: '.5rem',
          height: '40px',
          padding: 0,
          alignItems: 'center',
          color: mode === 'dark' ? 'white' : 'black',
          boxShadow: '0px 0px 3px 1px rgba(0,0,0,.2)'
        },
      }}
    >
      {tagList.map((tag, index) => (
        <Button key={`tag-record-${index}`} sx={{
            justifyContent: tag.icon ? 'start': 'center'
        }}>
          <CenterBox sx={{height: '40px', width: '40px'}}>
          {tag.icon ?? ''}
          </CenterBox>
          <Typography>{tag.title}</Typography>
        </Button>
      ))}
    </CenterBox>
  );
}
