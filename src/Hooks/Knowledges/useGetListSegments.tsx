import { useCallback, useEffect, useState } from "react";
import knowledgeService, {
  PayloadSegment,
} from "../../Services/knowledge.service";
import { AxiosResponse } from "axios";
import { useAuth } from "@/Providers/AuthenticationProvider";


export interface SegmentResponse {
    status_code: number;
    message:     string;
    segments:    Segment[];
}

export interface Segment {
    start_char_idx: number;
    end_char_idx:   number;
    class_name:     ClassName;
    mime_type:      MIMEType;
    page_label:     string;
    text:           string;
}

export enum ClassName {
    TextNode = "TextNode",
}

export enum MIMEType {
    TextPlain = "text/plain",
}

const useGetListSegment = (
  payload?: Omit<PayloadSegment, "user_id">,
  isTrigger = true
) => {
  const [data, setData] = useState<Segment[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { userId } = useAuth();

  const callApi = useCallback(() => {
    if (!payload || !userId) return;
    return knowledgeService.getListSegments({
      ...payload,
      user_id: userId,
    });
  }, [payload, userId]);

  const transformResponse = useCallback((response?: AxiosResponse<SegmentResponse>) => {
    if (response) {
      setData(response.data.segments);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      const response = await callApi();
      transformResponse(response);
    } catch (error: any) {
      setError(error);
    }
  }, []);

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
  }, [isTrigger]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetListSegment;
