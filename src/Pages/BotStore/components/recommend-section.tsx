import CenterBox from '@/Components/CommonStyles/Centerbox';
import Carousel from 'react-multi-carousel';
import { useBotStore } from '..';
import RecommendBox from './recommend-box';
import { Button, ButtonBase } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export default function RecommendSection() {
  const {} = useBotStore();

  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 3,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 1,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464,
      },
      items: 2,
      partialVisibilityGutter: 30,
    },
  };

  return (
    <CenterBox
      sx={{
        height: '40vh',
        width: '100%',
        // bgcolor: 'rgba(0,0,0,.2)',
        position: 'relative',
      }}
    >
      <CenterBox
        sx={{
          width: '100%',
          paddingX: '2rem',
          height: '100%',
          '>*': {
            height: '100%',
            width: '100%',
            button: { outline: 'none !important' },
          },
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container-with-dots"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={responsive}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          <RecommendBox
            description="Fixing CSS load order/style.chunk.css incorrect in Nextjs"
            headline="w3js.com - web front-end studio"
            image="https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
          />

          <RecommendBox
            description="Fixing CSS load order/style.chunk.css incorrect in Nextjs"
            headline="w3js.com - web front-end studio"
            image="https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          />

          <RecommendBox
            description="Fixing CSS load order/style.chunk.css incorrect in Nextjs"
            headline="w3js.com - web front-end studio"
            image="https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          />

          <RecommendBox
            description="Fixing CSS load order/style.chunk.css incorrect in Nextjs"
            headline="w3js.com - web front-end studio"
            image="https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          />

          <RecommendBox
            description="Fixing CSS load order/style.chunk.css incorrect in Nextjs"
            headline="w3js.com - web front-end studio"
            image="https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          />
        </Carousel>
      </CenterBox>
    </CenterBox>
  );
}
