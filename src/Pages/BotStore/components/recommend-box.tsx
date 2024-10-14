import CenterBox from '@/Components/CommonStyles/Centerbox';

export interface RecommendBoxProp {
  description: string;
  headline: string;
  image: string;
}

export default function RecommendBox({
  headline,
  description,
  image,
}: RecommendBoxProp) {
  return (
    <CenterBox
      sx={{ height: '37.5vh', padding: '1rem', boxSizing: 'border-box' }}
    >
      <CenterBox
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'white',
          borderRadius: '8px',
          boxShadow: '0px 0px 3px 2px rgba(0,0,0,.1)',
          flexDirection: 'column',
          overflow: 'hidden',
          justifyContent: 'start',
          objectFit: 'contain',
          img: {
            width: '100%',
            height: '100%',
          },
          position: 'relative',
          '*': {
            transition: '.5s',
            color: 'white',
          },
          '&:hover > .overlay': {
            opacity: 1
          },
          '&:hover > .overlay1': {
            bottom: '1rem'
          },
          '&:hover > .overlay2': {
            bottom: '1rem'
          },
        }}
      >
        <img src={image} />
        <CenterBox
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.5,
            transition: '.5s',
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.05646008403361347) 0%, rgba(0,0,0,1) 90%)',
          }}
        />
        <CenterBox
          className="overlay1"
          sx={{
            position: 'absolute',
            bottom: '-5rem',
            left: '1rem',
            width: 'calc(100% - 2rem)',
            flexDirection: 'column',
            gap: '.5rem',
            transition: '.5s',
          }}
        >
          <CenterBox
            sx={{ gap: '.5rem', height: '3rem', flex: 1, width: '100%' }}
          >
            <CenterBox
              sx={{
                width: '3rem',
                height: '3rem',
                bgcolor: 'white',
                borderRadius: '8px',
              }}
            ></CenterBox>
            <CenterBox
              sx={{
                flexDirection: 'column',
                height: '100%',
                flex: 1,
                alignItems: 'start',
              }}
            >
              <CenterBox
                sx={{
                  height: '2rem',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                Bot title
              </CenterBox>
              <CenterBox sx={{ gap: '.25rem' }}>
                <CenterBox
                  sx={{
                    width: '1rem',
                    height: '1rem',
                    bgcolor: 'white',
                    borderRadius: '4px',
                  }}
                ></CenterBox>
                <CenterBox
                  sx={{
                    flex: 1,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Author name
                </CenterBox>
              </CenterBox>
            </CenterBox>
          </CenterBox>
          <CenterBox
            sx={{
              width: '100%',
              height: '5rem',
              overflow: 'auto',
              alignItems: 'start',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            this is a bot description this is a bot description this is a bot
            description this is a bot description this is a bot description this
            is a bot description this is a bot description this is a bot
            description this is a bot description this is a bot description this
            is a bot description
          </CenterBox>
        </CenterBox>
      </CenterBox>
    </CenterBox>
  );
}
