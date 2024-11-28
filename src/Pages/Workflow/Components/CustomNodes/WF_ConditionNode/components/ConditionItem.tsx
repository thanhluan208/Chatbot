import { useMemo } from "react";
import {
  ComparisonOperator,
  ComparisonOperatorOptions,
  Condition,
} from "../type";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import {
  Vars,
  VarSelectorOptionInterface,
} from "../../WF_VariableAggregator/ListAssignVars";
import VarSelectorSelect from "../../WF_VariableAggregator/VarSelectorSelect";
import CommonStyles from "@/Components/CommonStyles";
import { Trash } from "lucide-react";

interface ConditionItemProps {
  condition: Condition;
  nodeId: string;
  handleUpdateCondition: (
    payload: Partial<Condition>,
    isRemove?: boolean
  ) => void;
}

const ConditionItem = ({
  nodeId,
  condition,
  handleUpdateCondition,
}: ConditionItemProps) => {
  const { data: varSelectors } = useGetVariableSelectors(nodeId);

  const varSelectorOptions = useMemo(() => {
    if (!varSelectors) return [];

    const options: VarSelectorOptionInterface[] = [];

    varSelectors.variable_selectors?.forEach((vars) => {
      const index = options.findIndex((elm) => elm.node === vars.value?.[0]);

      if (index !== -1) {
        options[index]?.vars.push({
          value: `${vars.value?.[0]}-${vars.value?.[1]}`,
          type: vars.type,
          name: vars.value?.[1],
        });
      } else {
        options.push({
          node: vars.value?.[0],
          vars: [
            {
              value: `${vars.value?.[0]}-${vars.value?.[1]}`,
              type: vars.type,
              name: vars.value?.[1],
            },
          ],
        });
      }
    });

    return options;
  }, [varSelectors]);

  const handleSelectVar = (vars: Vars) => {
    handleUpdateCondition({
      varType: vars.type,
      variable_selector: [vars.node || "", vars.name],
    });
  };

  const handleSelectComparisonOperator = (value: ComparisonOperator) => {
    handleUpdateCondition({
      comparison_operator: value,
    });
  };

  const handleRemoveCondition = () => {
    handleUpdateCondition(condition, true);
  };

  return (
    <div className="flex items-center gap-2">
      <VarSelectorSelect
        handleSelectVar={handleSelectVar}
        varSelectorOptions={varSelectorOptions}
        variables={
          condition.variable_selector ? [condition.variable_selector] : []
        }
        value={
          condition?.variable_selector
            ? `${condition?.variable_selector?.[0]}-${condition?.variable_selector?.[1]}`
            : undefined
        }
      />

      <CommonStyles.Select
        options={ComparisonOperatorOptions}
        value={condition.comparison_operator}
        disabled={!condition?.variable_selector}
        handleChange={handleSelectComparisonOperator}
      />

      <CommonStyles.Button
        hasBorder={false}
        className="!p-2 !min-w-0 !min-h-0 remove !h-fit !w-fit overflow-hidden"
        isIcon
        color="error"
        onClick={handleRemoveCondition}
      >
        <Trash size={12} />
      </CommonStyles.Button>
    </div>
  );
};

export default ConditionItem;
