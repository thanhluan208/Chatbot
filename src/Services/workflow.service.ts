import {
  AddEdgePayload,
  addNodeWorkflowPayload,
  CreateWorkflowResponse,
  deleteWorkflowPayload,
  queryWorkflow,
  queryWorkflowDetail,
  RemoveEdgePayload,
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
  updateWorkflowNodeData,
} from "@/Constants/api";
import { AxiosResponse } from "axios";
import { CommonResponse } from "@/Types/common";

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

  updateNodeData(payload: any): Promise<CommonResponse> {
    return httpServices.post(updateWorkflowNodeData, payload).then(res => res.data);
  }

  addEdge(payload: AddEdgePayload): Promise<CommonResponse> {
    return httpServices.post(updateWorkflowNodeData, payload).then(res => res.data);
  }

  removeEdge(payload: RemoveEdgePayload): Promise<CommonResponse> {
    return httpServices.post(updateWorkflowNodeData, payload).then(res => res.data);
  }
}

export default new WorkflowService();
