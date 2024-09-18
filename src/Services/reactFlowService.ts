import { ReactFlowInstance } from "@xyflow/react";
import { FormikProps } from "formik";
import httpServices from "./httpServices";
import { createNode, updateBotEdge, updateBotNode } from "@/Constants/api";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

class reactFlowServices {
  flows: {
    [key: string]: {
      form?: { [key: string]: FormikProps<any> };
      ref?: ReactFlowInstance | null;
    };
  } = {};

  subscribeForm(id: string, value: any, flowsId: keyof typeof this.flows) {
    this.flows[flowsId] = {
      ...this.flows[flowsId],
      form: {
        ...this.flows[flowsId]?.form,
        [id]: value,
      },
    };
  }

  subscribeRef(value: ReactFlowInstance, flowsId: keyof typeof this.flows) {
    this.flows[flowsId] = {
      ...this.flows[flowsId],
      ref: value,
    };
  }

  unsubscribeForm(id: string, flowsId: keyof typeof this.flows) {
    if (this?.flows?.[flowsId]?.form?.[id]) {
      delete this?.flows?.[flowsId]?.form?.[id];
    }
  }

  unsubscribeRef(flowsId: keyof typeof this.flows) {
    if (this?.flows?.[flowsId]?.ref) {
      delete this?.flows?.[flowsId]?.ref;
    }
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

  updateEdges(
    botId: string,
    userId: string,
    edges: {
      src_node: string;
      dest_node: string;
    }[],
    onFailed?: () => void
  ) {
    try {
      httpServices
        .post(updateBotEdge, {
          bot_id: botId,
          user_id: userId,
          bot_mode: "multi_agent",
          data: { edges },
        })
        .then((res: AxiosResponse<any>) => {
          if (res.data?.status_code !== 200) {
            onFailed && onFailed();
          }
        });
    } catch (error) {
      console.log("error", error);
      onFailed && onFailed?.();
    }
  }
}

export default new reactFlowServices();
