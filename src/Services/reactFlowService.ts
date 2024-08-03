import { ReactFlowInstance } from "@xyflow/react";
import { FormikProps } from "formik";

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
}

export default new reactFlowServices();
