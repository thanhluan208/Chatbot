import CenterBox from '@/Components/CommonStyles/Centerbox';
import { Button, ButtonProps, Tooltip, useTheme } from '@mui/material';
import { ReactNode, useCallback } from 'react';

type Props = {
  targetElement: string;
  icon?: ReactNode;
  title?: string;
  tooltip?: ReactNode;
} & Omit<ButtonProps, 'children'>;

export default function NavbarButton({
  targetElement,
  icon,
  title,
  sx,
  tooltip,
  onClick,
  ...props
}: Props) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const target = document.getElementById(targetElement);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', inline: 'start' });
      }
      if (onClick) {
        onClick(e);
      }
    },
    [targetElement, onClick]
  );
  const {
    palette: { mode },
  } = useTheme();
  return (
    <Button
      onClick={handleClick}
      sx={{
        display: 'flex',
        padding: '3px 1rem',
        paddingRight: icon ? '.5rem' : '1rem',
        bgcolor: mode === 'dark' ? 'transparent' : 'white',
        border: mode === 'dark' ? '1px solid rgba(255,255,255,.5)' : 'none',
        textTransform: 'none',
        color: mode === 'dark' ? 'rgba(255,255,255,.5)' : 'black',
        height: '32px',
        borderRadius: '6px',
        flexShrink: 0,
        boxSizing: 'border-box',
        boxShadow: '0px 2px 4px 0px #1E1E1F0A',
        // border: '2px solid black',
        '&:hover': {
          bgcolor: 'rgba(84,44,250,1)',
          color: 'white',
        },
        gap: '.2rem',
        ...sx,
      }}
      {...props}
    >
      <CenterBox>{title}</CenterBox>
      {icon && (
        <Tooltip
          sx={{
            height: '100%',
            aspectRatio: '1/1',
            width: '22px',
            flexShrink: 0,
          }}
          title={tooltip}
        >
          <CenterBox
            sx={{
              width: 'auto',
              height: '100%',
              aspectRatio: '1/1',
              fontSize: '1.5rem',
              '> *': {
                width: '75%',
                height: '75%',
              },
            }}
          >
            {icon}
          </CenterBox>
        </Tooltip>
      )}
    </Button>
  );
}
