import WorkflowSearchBox from "./components/WorkflowSearchBox";
import WorkflowFilter from "./components/WorkflowFilter";
import WorkflowDisplay from "./components/WorkflowDisplay";

export default function WorkflowStore() {
  return (
    <div className="flex flex-col p-[1rem] [&>*]:max-w-[800px] [&>*]:w-[100%] items-center [&_*]:font-[SegoeUI] gap-[1rem]">
      <WorkflowSearchBox />
      <WorkflowFilter />
      <WorkflowDisplay />
    </div>
  );
}
