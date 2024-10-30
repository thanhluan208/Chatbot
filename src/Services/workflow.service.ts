import {
  addNodeWorkflowPayload,
  CreateWorkflowResponse,
  deleteWorkflowPayload,
  queryWorkflow,
  queryWorkflowDetail,
  WorkflowDetailResponse,
  WorkflowResponse,
} from "@/Types/workflow";
import httpServices from "./httpServices";
import {
  addNodeWorkflowAPI,
  createWorkflowAPI,
  deleteWorkflowAPI,
  getWorkflowDetailAPI,
  getWorkFlowsAPI,
} from "@/Constants/api";
import { AxiosResponse } from "axios";

class WorkflowService {
  createWorkflow(
    payload: FormData
  ): Promise<AxiosResponse<CreateWorkflowResponse>> {
    return httpServices.post(createWorkflowAPI, payload);
  }

  deleteWorkflow(payload: deleteWorkflowPayload) {
    return httpServices.post(deleteWorkflowAPI, payload);
  }

  addNodeWorkflow(payload: addNodeWorkflowPayload) {
    return httpServices.post(addNodeWorkflowAPI, payload);
  }

  getWorkflows(query: queryWorkflow): Promise<WorkflowResponse> {
    return httpServices.post(getWorkFlowsAPI, query).then((res) => res.data);
  }

  getWorkflowDetail(query: queryWorkflowDetail): Promise<WorkflowDetailResponse>  {
  return httpServices.post(getWorkflowDetailAPI, query).then((res) => res.data);
  }
}

export default new WorkflowService();
