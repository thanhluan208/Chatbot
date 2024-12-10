import {
  AddEdgePayload,
  addNodeWorkflowPayload,
  AuthorizePayload,
  CheckToolAuthorPayload,
  CheckToolResponse,
  CheckWorkflowValidPayload,
  CreateWorkflowResponse,
  deleteWorkflowPayload,
  QueryVarSelector,
  queryWorkflow,
  queryWorkflowDetail,
  RemoveEdgePayload,
  UpdateNodeDataPayload,
  VarSelectorResponse,
  WorkflowDetailResponse,
  WorkflowResponse,
} from "@/Types/workflow";
import httpServices from "./httpServices";
import {
  addEdgeWorkflowAPI,
  addNodeWorkflowAPI,
  authorizeTool,
  checkToolAuthor,
  checkWorkflowValid,
  createWorkflowAPI,
  deleteWorkflowAPI,
  getVariableSelectors,
  getWorkflowDetailAPI,
  getWorkFlowsAPI,
  removeEdgeWorkflowAPI,
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

  getWorkflowDetail(
    query: queryWorkflowDetail
  ): Promise<WorkflowDetailResponse> {
    return httpServices
      .post(getWorkflowDetailAPI, query)
      .then((res) => res.data);
  }

  updateNodeData(payload: UpdateNodeDataPayload): Promise<CommonResponse> {
    return httpServices
      .post(updateWorkflowNodeData, payload)
      .then((res) => res.data);
  }

  addEdge(payload: AddEdgePayload): Promise<CommonResponse> {
    return httpServices
      .post(addEdgeWorkflowAPI, payload)
      .then((res) => res.data);
  }

  removeEdge(payload: RemoveEdgePayload): Promise<CommonResponse> {
    return httpServices
      .post(removeEdgeWorkflowAPI, payload)
      .then((res) => res.data);
  }

  getVarSelectors(query: QueryVarSelector): Promise<VarSelectorResponse> {
    return httpServices
      .post(getVariableSelectors, query)
      .then((res) => res.data);
  }

  authorizeTool(payload: AuthorizePayload): Promise<CommonResponse> {
    return httpServices.post(authorizeTool, payload).then((res) => res.data);
  }

  checkToolAuthor(payload: CheckToolAuthorPayload): Promise<CheckToolResponse> {
    return httpServices.post(checkToolAuthor, payload).then((res) => res.data);
  }

  checkWorkflowValid(payload: CheckWorkflowValidPayload): Promise<CommonResponse> {
    return httpServices.post(checkWorkflowValid, payload).then((res) => res.data);
  }
}

export default new WorkflowService();
