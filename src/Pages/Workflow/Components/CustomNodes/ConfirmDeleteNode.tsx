import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "@/Hooks/useToggleDialog";
import CommonStyles from "@/Components/CommonStyles";
import { useCallback } from "react";
import CommonIcons from "@/Components/CommonIcons";
import { useGet } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { useReactFlow } from "@xyflow/react";

interface IConfirmDeleteNode {
  nodeId: string;
}

const ConfirmDeleteNode = (props: IConfirmDeleteNode) => {
  //! State
  const { nodeId } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const { setNodes, setEdges } = useReactFlow();

  const nodes = useGet(cachedKeys.FLOW_NODES);
  const edges = useGet(cachedKeys.FLOW_EDGES);

  //! Function
  const handleDelete = useCallback(() => {
    const newNodes = nodes.filter((node: any) => node.id !== nodeId);
    const newEdges = edges.filter(
      (edge: any) => edge.source !== nodeId && edge.target !== nodeId
    );

    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodeId, nodes, edges, setNodes, setEdges]);

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog open={open} toggle={toggle} onClose={toggle}>
          <CommonStyles.ConfirmDialog
            toggle={toggle}
            handleConfirm={handleDelete}
            content="Do you want to delete this node ?"
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button onClick={toggle} color="error" isIcon>
        <CommonIcons.Delete />
      </CommonStyles.Button>
    </Fragment>
  );
};

export default ConfirmDeleteNode;
