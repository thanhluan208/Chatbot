import { getListToolWorkflow } from "@/Constants/api";
import httpServices from "./httpServices";
import { ToolProvider } from "@/Pages/Workflow/Components/Toolbar/type";

class ToolServices {
  getToolListWorkflow(): Promise<Record<string, ToolProvider>> {
    return httpServices.post(getListToolWorkflow, {}).then((res) => res.data?.tools);
  }
}

export default new ToolServices();
