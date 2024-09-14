import { ReactFlowInstance } from "@xyflow/react";
import { FormikProps } from "formik";
import httpServices from "./httpServices";
import { createNode } from "@/Constants/api";
import { AxiosResponse } from "axios";

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

  createFlow(
    botId: string,
    userId: string,
    onSuccess: (id: string) => void,
    onFailed: () => void
  ) {
    if (!botId || !userId) {
      onFailed();
    }
    httpServices
      .post(createNode, {
        bot_id: botId,
        user_id: userId,
      })
      .then((res: AxiosResponse<any>) => {
        if (res.data?.status === "success") {
          onSuccess(res.data.id);
        } else {
          onFailed();
        }
      })
      .catch((err) => {
        console.log("err", err);
        onFailed();
      });
  }
}

export default new reactFlowServices();
