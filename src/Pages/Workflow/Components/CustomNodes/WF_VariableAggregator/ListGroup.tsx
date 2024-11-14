import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import ListAssignVars from "./ListAssignVars";
import { Group } from "./type";
import { cloneDeep } from "lodash";
import { memo } from "react";

interface ListGroupProps {
  groups: Group[];
  nodeId: string;
}

const ListGroup = ({ groups, nodeId }: ListGroupProps) => {
  const { handleUpdateNodeDataVarAgg } = useWorkflowMutate();

  const handleUpdateGroup = (groupData: Group, isRemove?: boolean) => {
    let hasAdded = false;


    const newGroup = cloneDeep(groups).reduce((acc, cur) => {
      if (cur.group_name === groupData.group_name) {
        if (isRemove) return acc;
        acc.push({
          ...groupData,
          group_name: groupData.newName || groupData.group_name,
        });
        hasAdded = true;
        return acc;
      }

      acc.push(cur);
      return acc;
    }, [] as Group[]);

    if (!hasAdded && !isRemove) {
      newGroup.push({
        ...groupData,
        group_name: groupData.newName || groupData.group_name,
      });
    }


    handleUpdateNodeDataVarAgg(nodeId, {
      advanced_settings: {
        groups: newGroup,
      },
    } as any);
  };

  return (
    <div className="flex flex-col gap-2">
      {groups &&
        groups?.map((group) => {
          return (
            <ListAssignVars
              key={group.group_name}
              nodeId={nodeId}
              output_type={group.output_type}
              variables={group.variables}
              isGroupItem
              groupName={group.group_name}
              handleUpdateGroup={handleUpdateGroup}
            />
          );
        })}

      <ListAssignVars
        nodeId={nodeId}
        output_type="none"
        variables={[]}
        isGroupItem
        groupName={`Group ${groups.length + 1}`}
        handleUpdateGroup={handleUpdateGroup}
        disabledRemove
      />
    </div>
  );
};

export default memo(ListGroup);
