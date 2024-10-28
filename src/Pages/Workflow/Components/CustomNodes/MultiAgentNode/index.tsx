import React, { Fragment, useEffect, useRef } from "react";
import {
  Handle,
  MarkerType,
  NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { v4 as uuid } from "uuid";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { AllQueryKeys, useGet, useSave } from "@/Stores/useStore";
import reactFlowService from "@/Services/reactFlowService";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { toast } from "react-toastify";

import WrapperNodeLabel from "./components/WrapperNodeLabel";
import NodeForm from "./components/NodeForm";
import GradientBorder from "../../GradientBorder";

const MultiAgentNode = (props: NodeProps) => {
  //! State
  const { data } = props;
  const shouldRemove = useGet(`${props.id}_remove` as AllQueryKeys);
  const { setNodes, setEdges, updateNode, updateEdge, getNode } =
    useReactFlow();
  const [isAdding, setIsAdding] = React.useState(false);

  const placeholderId = useRef<string | null>(uuid());

  const save = useSave();

  const params = useParams();
  const botId = params?.botId;

  const { userId } = useAuth();

  //! Function
  const handleAddPlaceholder = () => {
    if (isAdding) return;
    setIsAdding(true);
    const newId = uuid();
    placeholderId.current = newId;
    const newNode = {
      id: newId,
      type: props.type,
      position: {
        x:
          props.positionAbsoluteX +
          (props?.width ?? 500) +
          Math.floor(Math.random() * 200 + 300),
        y: props.positionAbsoluteY + Math.floor(Math.random() * 1000 - 500),
      },
      data: {
        isPlaceholder: true,
      },
    };

    setNodes((nodes) => nodes.concat(newNode));
    setEdges((edges) =>
      edges.concat({
        id: `${props.id}-${newId}`,
        source: props.id,
        target: newId,
        animated: true,
        type: "animatedSvg",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#4e40e5",
        },
        data: {
          isPlaceholder: true,
        },
        deletable: true,
      })
    );
  };

  const handleRemovePlaceholder = () => {
    if (!placeholderId.current) return;
    save(`${placeholderId.current}_remove`, true);
    setIsAdding(false);
    setEdges((edges) => {
      const newEdges = edges.filter((edge) => {
        return !edge.data?.isPlaceholder;
      });

      console.log("newEdges", newEdges);
      return newEdges;
    });
  };

  const handleAddNode = () => {
    if (!placeholderId.current || !userId) return;
    const newNode = getNode(placeholderId.current);

    if (!newNode) return;

    const onSuccess = (id: string) => {
      updateNode(newNode.id, {
        id: id,
        data: {
          label: `Agent ${id}`,
        },
      });
      updateEdge(`${props.id}-${newNode.id}`, {
        data: {
          isPlaceholder: false,
        },
        target: id,
        animated: false,
      });
    };

    const onFailed = () => {
      save(`${newNode.id}_remove`, false);
      setEdges((edges) =>
        edges.filter((edge) => edge.id !== `${props.id}-${newNode.id}`)
      );
      toast.error("Failed to create agent");
    };

    reactFlowService.createFlow(
      botId as string,
      userId,
      onSuccess,
      onFailed,
      JSON.stringify({
        position: newNode?.position,
      }),
      props.id
    );

    placeholderId.current = null;
    setIsAdding(false);
  };

  useEffect(() => {
    const node = document.getElementById(props.id);
    if (node && shouldRemove) {
      node.style.opacity = "0";
    }

    setTimeout(() => {
      if (node && shouldRemove) {
        setNodes((nodes) => nodes.filter((n) => n.id !== props.id));
      }
    }, 500);
  }, [shouldRemove, props.id]);

  useEffect(() => {
    if (props.selected) {
      setEdges((edges) => {
        return edges.map((edge) => {
          if (edge.source === props.id || edge.target === props.id) {
            return {
              ...edge,
              animated: true,
            };
          }
          return {
            ...edge,
            animated: false,
          };
        });
      });
    } else {
      setEdges((edge) =>
        edge.map((item) => ({
          ...item,
          animated: false,
        }))
      );
    }
  }, [props?.selected, props?.id]);

  //! Render
  return (
    <Fragment>
      <GradientBorder {...props}>
        <CollapseArea
          nodeId={props.id}
          dataKey="wrapperNode"
          initOpen={!!props?.data?.currentNode}
          key={props?.data?.currentNode as any}
          label={
            <WrapperNodeLabel
              data={props.data}
              nodeId={props.id}
              positionAbsoluteX={props.positionAbsoluteX}
              positionAbsoluteY={props.positionAbsoluteY}
            />
          }
          sxContainer={{
            marginTop: "0",
            "& .collapse-header": {
              marginBottom: "0",
            },
          }}
        >
          <NodeForm data={props.data} nodeId={props.id} />
        </CollapseArea>
      </GradientBorder>

      <Handle
        type="source"
        position={Position.Right}
        id={`${props?.id}-source`}
        isConnectable={true}
        className="handle"
        onMouseEnter={handleAddPlaceholder}
        onMouseLeave={handleRemovePlaceholder}
        onClick={handleAddNode}
        style={{
          right: "3px",
        }}
      />
      {!data?.startNode && (
        <Handle
          type="target"
          position={Position.Left}
          id={`${props?.id}-target`}
          isConnectable={true}
          className="handle"
          style={{
            left: "3px",
          }}
        />
      )}
    </Fragment>
  );
};

export default React.memo(MultiAgentNode);
