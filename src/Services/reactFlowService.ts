import httpServices from "./httpServices";
import {
  createNode,
  removeEdge,
  updateBotEdge,
  updateBotNode,
} from "@/Constants/api";
import { Edge, Node } from "@xyflow/react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

class reactFlowServices {
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>> | null = null;
  getEdges: () => Edge[] | [] = () => [];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>> | null = null;
  getNodes: () => Node[] | [] = () => [];

  subcribeFlow(
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    getEdges: () => Edge[],
    getNodes: () => Node[]
  ) {
    this.setEdges = setEdges;
    this.setNodes = setNodes;
    this.getEdges = getEdges;
    this.getNodes = getNodes;
  }

  unsubcribeFlow() {
    this.setEdges = null;
    this.setNodes = null;
  }

  async createFlow(
    botId: string,
    userId: string,
    onSuccess: (id: string) => void,
    onFailed: () => void,
    nodeInfo?: string,
    fromId?: string
  ) {
    if (!botId || !userId) {
      console.log("botId or userId is missing");
      onFailed();
    }
    return httpServices
      .post(createNode, {
        bot_id: botId,
        user_id: userId,
        info: nodeInfo,
        from_node_id: fromId,
      })
      .then((res: AxiosResponse<any>) => {
        if (res.data?.status_code === 200) {
          onSuccess(res.data.node_id);
        } else {
          console.log("Failed to create node", res.data);
          onFailed();
        }
      })
      .catch((err) => {
        console.log("err", err);
        onFailed();
      });
  }

  async updateFlow(botId: string, id: string, data: string) {
    if (!botId || !id) {
      return;
    }
    return httpServices
      .post(updateBotNode, {
        bot_id: botId,
        node_id: id,
        info: data,
      })
      .then((res: AxiosResponse<any>) => {
        if (res.data?.status_code !== 200) {
          toast.error("Failed to update node");
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Failed to update node");
      });
  }

  updateEdge(
    isAdd: boolean,
    botId: string,
    src_node_id: string,
    dest_node_id: string,
    onFailed?: () => void
  ) {
    let handleFail = () => {
      this.setEdges &&
        this.setEdges((edges) =>
          edges.filter(
            (elm) => elm.target !== dest_node_id && elm.source !== src_node_id
          )
        );
    };

    if (!isAdd) {
      handleFail = () => {
        this.setEdges &&
          this.setEdges((edges) =>
            edges.concat([
              {
                source: src_node_id,
                target: dest_node_id,
                id: `${src_node_id}_${dest_node_id}`,
              },
            ])
          );
      };
    }

    try {
      httpServices
        .post(isAdd ? updateBotEdge : removeEdge, {
          bot_id: botId,
          src_node_id,
          dest_node_id,
        })
        .then((res: AxiosResponse<any>) => {
          if (res.data?.status_code !== 200) {
            handleFail();
            onFailed && onFailed();
          }
        });
    } catch (error) {
      console.log("error", error);
      handleFail();
      onFailed && onFailed?.();
    }
  }
}

export default new reactFlowServices();
