import {
  IcBaselineDiscord,
  IcBaselineEmail,
} from '@/Components/CommonIcons/Dashboard';
import CenterBox from '@/Components/CommonStyles/Centerbox';

export default function DashboardFooter() {
  return (
    <CenterBox
      sx={{
        width: '100%',
        height: '250px',
        // backgroundImage:
        //   'linear-gradient(0deg, rgba(84,44,250,.7) 0%, rgba(244,244,246,1) 75%)',
      }}
    >
      <CenterBox
        sx={{
          gap: '36px',
          padding: '2rem',
          position: 'absolute',
          bottom: '1rem',
          height: '20px',
          '@media only screen and (max-width: 1000px)': {
            flexDirection: 'column',
            gap: '16px',
            '> *': {
              gap: '16px !important',
            },
          },
          //   flexWrap: 'wrap',
          //   '*': { color: 'white' },
          '> *': {
            gap: '36px',
            '>*': {
              gap: '4px',
              cursor: 'pointer',
              '&:hover': {
                '&,*': { textDecoration: 'underline' },
              },
            },
          },
        }}
      >
        <CenterBox sx={{ gap: '36px' }}>
          <CenterBox>
            <IcBaselineEmail />
            <CenterBox>aphii@support.com</CenterBox>
          </CenterBox>
          <CenterBox>
            <IcBaselineDiscord />
            Discord
          </CenterBox>
        </CenterBox>
        <CenterBox>
          <CenterBox>Terms of Service</CenterBox>
          <CenterBox>Privacy Policy</CenterBox>
          <CenterBox
            sx={{
              '@media only screen and (max-width: 1000px)': { display: 'none' },
            }}
          >
            Manage Cookies
          </CenterBox>
          <CenterBox
            sx={{
              '@media only screen and (max-width: 1000px)': { display: 'none' },
            }}
          >
            Data Processing Addendum
          </CenterBox>
        </CenterBox>
      </CenterBox>
    </CenterBox>
  );
}
