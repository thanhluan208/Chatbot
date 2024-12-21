import queryKey from "@/Constants/queryKey";
import toolService from "@/Services/tool.service";
import { useQuery } from "react-query";

export default function useGetListTool() {
 return useQuery({
    queryKey: [queryKey.TOOL_LIST],
    queryFn: () => {
      return toolService.getToolListWorkflow();
    },
  });

}
