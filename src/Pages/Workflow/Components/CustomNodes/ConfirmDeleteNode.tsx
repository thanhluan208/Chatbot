import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "@/Hooks/useToggleDialog";
import CommonStyles from "@/Components/CommonStyles";
import { useCallback } from "react";
import CommonIcons from "@/Components/CommonIcons";
import { useReactFlow } from "@xyflow/react";

interface IConfirmDeleteNode {
  nodeId: string;
}

const ConfirmDeleteNode = (props: IConfirmDeleteNode) => {
  //! State
  const { nodeId } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  //! Function
  const handleDelete = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();

    const newNodes = nodes.filter((node: any) => node.id !== nodeId);
    const newEdges = edges.filter(
      (edge: any) => edge.source !== nodeId && edge.target !== nodeId
    );

    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodeId, setNodes, setEdges]);

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
