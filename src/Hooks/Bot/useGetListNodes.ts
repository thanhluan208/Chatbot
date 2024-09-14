import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Providers/AuthenticationProvider";
import botService from "../../Services/bot.service";
import { AxiosResponse } from "axios";
import { Node } from "@xyflow/react";

type Payload = {
  botId: string;
  nodeIds: string[];
};

export interface NodeResponse {
  status_code: number;
  message: string;
  data: Data;
}

export interface Data {
  class_name: string;
  info: string;
  metadata: Metadata;
  node_id: string;
  knowledge_storage_ids: any[];
}

export interface Metadata {
  user_id: string;
  tools: any[];
  system_prompt: string;
  llm: Llm;
}

export interface Llm {
  class_name: string;
  model: string;
  temperature: number;
  max_tokens: null;
  additional_kwargs: AdditionalKwargs;
}

export interface AdditionalKwargs {}

export interface NodeInfo {
  id: string;
  type: string;
  position: Position;
  data: Data;
}

export interface Data {
  label: string;
}

export interface Position {
  x: number;
  y: number;
}

const useGetListNodes = (payload: Payload, isTrigger = true) => {
  const [data, setData] = useState<Node[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { userId } = useAuth();

  const callApi = useCallback(() => {
    if (!userId || !payload.botId) return;
    const listPromise: any = [];
    payload.nodeIds.forEach((node) => {
      listPromise.push(
        botService.getNode({
          bot_id: payload?.botId,
          node_id: node,
        })
      );
    });

    return Promise.all(listPromise);
  }, [userId, payload?.botId, payload?.nodeIds]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<NodeResponse>[]) => {
      const formattedData = response?.map((res) => {
        const resData = res.data.data;
        const resInfo: NodeInfo = JSON.parse(resData.info);
        return {
          id: resData.node_id,
          type: "customNode_multiAgentNode",
          position: {
            x: resInfo.position.x,
            y: resInfo.position.y,
          },
          data: {
            ...resData.metadata,
          },
        };
      });

      console.log('formattedData',formattedData)
      setData(formattedData as Node[]);
    },
    []
  );

  const refetch = useCallback(async () => {
    try {
      const response = await callApi();
      transformResponse(response);
    } catch (error: any) {
      setError(error);
    }
  }, [callApi]);

  useEffect(() => {
    let shouldSetData = true;

    if (isTrigger) {
      (async () => {
        try {
          setLoading(true);
          const response = await callApi();

          if (shouldSetData) {
            transformResponse(response);
          }
        } catch (error: any) {
          setError(error);
        } finally {
          setLoading(false);
        }
      })();

      return () => {
        shouldSetData = false;
      };
    }
  }, [isTrigger, callApi]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetListNodes;
