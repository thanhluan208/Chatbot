import CommonStyles from "@/Components/CommonStyles";
import { memo, useEffect, useState } from "react";

interface ResultItemProps {
  result: string;
  handleAddresult: () => void;
  shouldAnimate?: boolean;
}

const ResultItem = ({
  result,
  handleAddresult,
  shouldAnimate,
}: ResultItemProps) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!shouldAnimate) {
      setValue(result);
      return;
    }
    let index = 0;
    const interval = setInterval(() => {
      setValue(result.substring(0, index));
      index++;
      if (index >= result.length) {
        handleAddresult();
        clearInterval(interval);
      }
    }, 20);
  }, [result, shouldAnimate]);


  return (
    <CommonStyles.Input
      initValue={value}
      key={value}
      multiline
      minRows={2}
      fullWidth
    />
  );
};

export default memo(ResultItem);
