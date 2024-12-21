import useGetListTool from "@/Hooks/tool/useGetListTool";

const ToolStore = () => {
  const { data } = useGetListTool();

  console.log('data',data)

  return <div>ToolStore</div>;
};

export default ToolStore;
