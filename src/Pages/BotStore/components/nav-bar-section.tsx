import CenterBox from '@/Components/CommonStyles/Centerbox';
import NavbarButton from './navbar-button';
import {
  IcBaselineDiscord,
  IcOutlineAccessTime,
  IcOutlineTelegram,
  MaterialSymbolsHelpOutline,
  MaterialSymbolsTrendingUpRounded,
  PhMessengerLogoLight,
  PhRanking,
} from '@/Components/CommonIcons/Dashboard';

export default function DashboardNavbar() {
  return (
    <CenterBox
      sx={{
        // bgcolor: 'rgba(0,0,0,.2)',
        flexShrink: 0,
        height: '50px',
        width: '100%',
        position: 'sticky',
        top: 0,
        paddingX: '112px',
        justifyContent: 'start',
        mb: '2rem',
        boxShadow: '0px 5px 5px rgba(0,0,0,.2)',
        overflow: 'auto',
        gap: '1rem',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '@media only screen and (max-width: 1000px)': {
          top: 98,
          paddingX: '1rem',
          '.mobile-hidden': {
            display: 'none',
          },
        },
      }}
    >
      <NavbarButton
        className="mobile-hidden"
        targetElement="recommended-section"
        title="Recommended"
        tooltip={'Min'}
        icon={<MaterialSymbolsHelpOutline />}
      />
      <NavbarButton
        targetElement="trending-section"
        title="Trending"
        tooltip={'Min'}
        icon={<MaterialSymbolsTrendingUpRounded />}
      />
      <NavbarButton
        sx={{ '@media only screen and (max-width: 1000px)': { flex: 1 } }}
        targetElement="dis"
        title="Recent"
        tooltip={'Min'}
        icon={<IcOutlineAccessTime />}
      />
      <NavbarButton
        sx={{ '@media only screen and (max-width: 1000px)': { flex: 1 } }}
        targetElement="dis"
        title="Ranking"
        tooltip={'Min'}
        icon={<PhRanking />}
      />
      <NavbarButton
        className="mobile-hidden"
        targetElement="dis"
        title="Discord"
        tooltip={'Min'}
        icon={<IcBaselineDiscord />}
      />
      <NavbarButton
        className="mobile-hidden"
        targetElement="dis"
        title="Telegram"
        tooltip={'Min'}
        icon={<IcOutlineTelegram />}
      />
      <NavbarButton
        className="mobile-hidden"
        targetElement="dis"
        title="Messenger"
        tooltip={'Min'}
        icon={<PhMessengerLogoLight />}
      />
    </CenterBox>
  );
}
