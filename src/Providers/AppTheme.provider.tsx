import React, { useCallback, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { CssBaseline } from "@mui/material";
import { GlobalStyles } from "@mui/material";

import cachedKeys from "../Constants/cachedKeys";
import { useSave } from "../Stores/useStore";
import { CustomColors } from "./type";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";

declare module "@mui/material/styles" {
  interface Theme {
    colors: {
      custom: CustomColors;
    };
  }
  interface ThemeOptions {
    colors?: {
      custom?: CustomColors;
    };
  }
  interface BreakpointOverrides {
    xmd: true;
  }
}

const lightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      xmd: 1100,
      lg: 1200,
      xl: 1536,
    },
  },

  typography: {
    // fontFamily: ['Epilogue, sans-serif'].join(','),
    fontFamily: "SegoeUI",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Light"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf) format("truetype");
        font-weight: 100;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Semilight"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.ttf) format("truetype");
        font-weight: 200;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf) format("truetype");
        font-weight: 400;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Bold"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.ttf) format("truetype");
        font-weight: 600;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Semibold"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.ttf) format("truetype");
        font-weight: 500;
    }
      `,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#4e40e5",
      light: "#4d53e826",
    },
  },
  colors: {
    custom: {
      backgroundCard: "#ffffff ", // Light gray for card background
      backgroundCardHover: "#e0e0e0", // Slightly darker for hover effect
      borderColor: "rgb(228, 228, 231)", // Light gray for borders
      boxShadow:
        "0 4px 12px 0px rgba(0,0,0,0.08), 0px 8px 24px 0px rgba(0,0,0,0.04)", // Darker shadow for contrast

      //* Main
      background: "#fbfbfb",
      backgroundSecondary: "#fbfbfb", // Light gray for secondary background

      //* Button
      backgroundButtonHover: "#e3f2fd", // Light blue with transparency for button hover

      //* Typo
      primaryColorTypo: "#000", // Dark color for primary text
      normalColorTypo: "#333", // Dark gray for normal text
      semiColorTypo: "#555", // Slightly lighter gray for secondary text
      colorErrorTypo: "#d32f2f", // Dark red for errors

      //* Dialog
      backgroundDialog: "#ffffff", // White for dialog background

      //* Star
      colorStar: "#ffca28", // Gold for stars

      //* Button
      colorActive: "#f5f5f5", // Light gray for active button background

      //* Tab
      backgroundTab: "#f3f3f3", // Very light gray for tabs
    },
  },
});

const darkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      xmd: 1100,
      lg: 1200,
      xl: 1536,
    },
  },

  typography: {
    fontFamily: "SegoeUI",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Light"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf) format("truetype");
        font-weight: 100;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Semilight"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.ttf) format("truetype");
        font-weight: 200;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf) format("truetype");
        font-weight: 400;
    }
    
    @font-face {
        font-family: SegoeUI; 
        src:
            local("Segoe UI Bold"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.ttf) format("truetype");
        font-weight: 600;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Semibold"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.ttf) format("truetype");
        font-weight: 500;
    }
      `,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#4e40e5",
      light: "#4d53e826",
    },
  },
  colors: {
    custom: {
      backgroundCard: "#09090b",
      backgroundCardHover: "#1d1d2914",
      borderColor: "rgb(39, 39, 42)",
      boxShadow:
        "0 4px 8px 0px rgba(255,255,255,0.08), 0px 8px 16px 0px rgba(255,255,255,0.04)",

      //* Main
      background: "#151518",
      backgroundSecondary: "#151518",

      //* Button
      backgroundButtonHover: "#1976d214",

      //* Typo
      primaryColorTypo: "#1f1e7d",
      normalColorTypo: "#fff",
      semiColorTypo: "#383743",
      colorErrorTypo: "#ff1515",

      //* Dialog
      backgroundDialog: "#26272b",

      //* Star
      colorStar: "#f7c52b",

      //* Button
      colorActive: "#232326",

      //* Tab
      backgroundTab: "#4b4a580a",
    },
  },
});

export enum Theme {
  light = "light",
  dark = "dark",
}

export const keyTheme = "theme-mode";

const switchTheme = {
  [Theme.dark]: darkTheme,
  [Theme.light]: lightTheme,
};

let initTheme = localStorage.getItem(keyTheme) as Theme;
if (!!window.matchMedia && !initTheme) {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    initTheme = Theme.dark;
  } else {
    initTheme = Theme.light;
  }
}

export default function AppThemeProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const save = useSave();
  const [theme, setTheme] = useState<Theme>(initTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === Theme.light ? Theme.dark : Theme.light;
      localStorage?.setItem(keyTheme, nextTheme);
      return nextTheme;
    });
  }, []);

  useEffect(() => {
    save(cachedKeys.toggleTheme, toggleTheme);
  }, [save, toggleTheme]);

  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newColorScheme = event.matches ? Theme.dark : Theme.light;
        setTheme(newColorScheme);
      });
  }, []);

  return (
    <ThemeProvider theme={switchTheme[theme]}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            // fontFamily: 'Epilogue, sans-serif',
            fontFamily: "Plus Jakarta Sans",
          },
        }}
      />
      {children}
      <CommonStyles.Button
        isIcon
        isRound={false}
        variant="outlined"
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
        onClick={toggleTheme}
      >
        {theme === Theme.light ? (
          <CommonIcons.LightMode />
        ) : (
          <CommonIcons.DarkMode />
        )}
      </CommonStyles.Button>
    </ThemeProvider>
  );
}
