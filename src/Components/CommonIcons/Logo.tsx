const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
    >
      <g
        stroke="#fff"
        clipPath="url(#icon-official-label_svg__a)"
        filter="url(#icon-official-label_svg__b)"
      >
        <path
          fill="#4D53E8"
          strokeWidth="1.497"
          d="m6.928 14.731-.14-.655.14.655Zm4.817 1.5.275.228c1.128.943 2.914.436 3.278-1.034a.543.543 0 0 1 .489-.412l.83-.057c2.365-.165 2.528-3.412.323-3.957a.531.531 0 0 1-.388-.644l.215-.872c.793-3.204-1.233-6.427-4.475-7.228-3.241-.802-6.536 1.105-7.329 4.309l-.215.872a.531.531 0 0 1-.643.388c-2.206-.546-3.575 2.403-1.56 3.651l.708.438c.2.124.298.364.24.592-.363 1.47.98 2.752 2.419 2.444l.35-.075c.712 2.304 3.779 3.062 5.483 1.356Z"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.089"
          d="m8.523 7.85.024.037a2.098 2.098 0 0 0 2.867.677v0"
        ></path>
      </g>
      <defs>
        <clipPath id="icon-official-label_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z"></path>
        </clipPath>
        <filter
          id="icon-official-label_svg__b"
          width="22"
          height="22.5"
          x="-1"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="1.5"></feOffset>
          <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_7131_103589"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_7131_103589"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  );
};

export default Logo;
