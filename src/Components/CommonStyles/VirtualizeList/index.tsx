import { Box, useTheme } from "@mui/material";
import React from "react";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import CommonStyles from "..";

const DynamicHeightList = ({ items, onClick }: any) => {
  const theme = useTheme();
  const cache = React.useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50,
    })
  );

  const rowRenderer = ({ index, key, parent, style }: any) => {
    const item = items[index];

    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {() => (
          <Box
            sx={{
              ...style,
              padding: "25px 20px",
              boxSizing: "border-box",
              cursor: onClick ? "pointer" : "default",
            }}
            onClick={() => {
              onClick(item);
            }}
          >
            {/* Render your item here */}

            <Box
              sx={{
                padding: "24px",
                background: theme.colors.custom.backgroundCard,
                borderRadius: "12px",
                border: `1px solid ${theme.palette.primary.main}`,
                transition: "all 0.3s ease",
                boxShadow: theme.colors.custom.boxShadow,
                "&:hover": {
                  background: theme.colors.custom.backgroundCardHover,
                },
              }}
            >
              <CommonStyles.Typography
                sx={{
                  whiteSpace: "pre-line",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  display: "-webkit-box",
                }}
              >
                {item.text}
              </CommonStyles.Typography>
            </Box>
          </Box>
        )}
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          width={width}
          height={height}
          rowCount={items.length}
          deferredMeasurementCache={cache.current}
          rowHeight={cache.current.rowHeight}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  );
};

export default DynamicHeightList;
