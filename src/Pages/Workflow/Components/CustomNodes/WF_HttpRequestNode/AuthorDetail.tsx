import { memo, useRef } from "react";
import { AuthorConfigType, NodeDataHTTPRequest } from "./type";
import CommonStyles from "@/Components/CommonStyles";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import EditorPrompt from "../../misc/EditorPromtpt";

interface AuthorDetailProps {
  type: AuthorConfigType;
  header: string;
  apiKey: string;
  nodeId: string;
}

const AuthorDetail = ({ type, header, apiKey, nodeId }: AuthorDetailProps) => {
  const debounceRef = useRef<number | null>(null);

  const { handleUpdateNodeDataHttpRequest } = useWorkflowMutate();

  const handleChangeHeader = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    if (value === header) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      handleUpdateNodeDataHttpRequest(nodeId, {
        authorization: {
          config: {
            type,
            api_key: apiKey,
            header: value,
          },
        },
      } as Partial<NodeDataHTTPRequest>);
    }, 300);
  };

  const handleChangeApiKey = (id: string, value: string) => {
    if (value === apiKey) return;

    handleUpdateNodeDataHttpRequest(id, {
      authorization: {
        config: {
          type,
          header,
          api_key: value,
        },
      },
    } as Partial<NodeDataHTTPRequest>);
  };

  return (
    <div className="mt-3">
      {type === AuthorConfigType.CUSTOM && (
        <CommonStyles.Input
          label="Header"
          placeholder="Enter header..."
          initValue={header}
          afterOnchange={handleChangeHeader}
        />
      )}

      <EditorPrompt
        id={`${nodeId}-apikey`}
        nodeId={nodeId}
        value={apiKey}
        handleChangeEditor={handleChangeApiKey}
        className="min-h-10"
        placeholder="Enter api key..."
      />
    </div>
  );
};

export default memo(AuthorDetail);
