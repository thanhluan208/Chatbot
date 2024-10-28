import PromptEditor from "@/Components/CommonStyles/EditorPlugin";
import { BlockEnum, VarType } from "@/Components/CommonStyles/EditorPlugin/type";
import { Box } from "@mui/material";
import { useBoolean } from "ahooks";

interface EditorProps {
  controlPromptEditorRerenderKey: string;
  nodeId: string;
  readOnly?: boolean;
}


const Editor = ({ controlPromptEditorRerenderKey, nodeId,readOnly }: EditorProps) => {

  const onChange = (value: string) => {
    console.log(value);
  };

  const [_, {
    setTrue: setFocus,
    setFalse: setBlur,
  }] = useBoolean(false)

  return (
    <Box sx={{
        fontFamily: 'SegoeUI'
    }}>
      <PromptEditor
        key={controlPromptEditorRerenderKey}
        instanceId={nodeId}
        compact
        className="min-h-[56px] px-3 py-2"
        value={""}
        contextBlock={{
          show: true,
          selectable: true,
          canNotAddContext: true,
        }}
        workflowVariableBlock={{
          show: true,
          variables: [{
            nodeId: 'sys',
            title: 'Start',
            vars: [
              {
                type: VarType.string,
                variable: 'variable',
              }
            ]
          }] || [],
          workflowNodesMap: {
            'sys': {
              title: 'Start',
              type: BlockEnum.Start
            }
          },
        }}
        onChange={onChange}
        onBlur={setBlur}
        onFocus={setFocus}
        editable={!readOnly}
      />
    </Box>
  );
};

export default Editor;
