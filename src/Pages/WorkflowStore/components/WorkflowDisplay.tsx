import { useEffect, useMemo, useRef, useState } from "react";
import WorkflowDisplayElement from "./WorkflowDisplayElement";

export default function WorkflowDisplay() {
  const containerEle = useRef<HTMLInputElement | null>(null);
  const [itemCount, setItemCount] = useState<number>(0);
  const [data, setData] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (!containerEle.current) return;

    const obsFunc = new ResizeObserver(([entry]) => {
      if (entry) {
        const newWidth = entry.contentRect.width;
        const res = Math.floor(newWidth / 300);
        setItemCount(res === 0 ? 1 : res);
      }
    });

    if (containerEle.current) {
      obsFunc.observe(containerEle.current);
    }

    return () => {
      obsFunc.disconnect();
    };
  }, [containerEle.current]);

  return (
    <div className="flex flex-wrap gap-[1rem] !max-w-[100%]" ref={containerEle}>
      {data.map((item, i) => {
        console.log(i);

        return (
          <WorkflowDisplayElement itemCount={itemCount} key={i}/>
        );
      })}
    </div>
  );
}
