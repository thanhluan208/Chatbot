import { useFormikContext } from "formik";
import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../../../Components/CommonStyles";
import { initialValueEngine } from "../../EngineButton";
import SlideAndNumField from "./SlideAndNumField";

const TemperatureHint = () => {
  return (
    <div>
      <div>
        <strong>Temperature</strong>:
      </div>
      <ul>
        <li>
          <CommonStyles.Typography>
            When you increase this value, the model outputs more diverse and
            innovative content; when you decrease it, the model outputs less
            diverse content that strictly follows the given instructions.
          </CommonStyles.Typography>
        </li>
        <li>
          <CommonStyles.Typography>
            {" "}
            It is recommended not to adjust this value with "Top p" at the same
            time.
          </CommonStyles.Typography>
        </li>
      </ul>
    </div>
  );
};

const TopPHInt = () => {
  return (
    <div>
      <div>
        <strong>Top P</strong>:
      </div>
      <ul>
        <li>
          <CommonStyles.Typography>
            An alternative to sampling with temperature, where only tokens
            within the top p probability mass are considered. For example, 0.1
            means only the top 10% probability mass tokens are considered.
          </CommonStyles.Typography>
        </li>
        <li>
          <CommonStyles.Typography>
            We recommend altering this or temperature, but not both.
          </CommonStyles.Typography>
        </li>
      </ul>
    </div>
  );
};

const Advance = () => {
  //! State
  const { values } = useFormikContext<initialValueEngine>();
  const { model } = values || {};

  //! Function

  //! Render
  if (!model) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <CommonStyles.Typography type="semiBold16" mt={"16px"}>
        Advance
      </CommonStyles.Typography>

      <div className="px-2">
        <SlideAndNumField
          hintContent={<TemperatureHint />}
          name="temperature"
          title="Temperature"
          min={model ? model.temperature.min : 0}
          max={model ? model.temperature.max : 2}
        />

        <SlideAndNumField
          hintContent={<TopPHInt />}
          name="top_p"
          title="Top P"
          min={model.top_p?.min ? model.top_p?.min : 0}
          max={model.top_p?.max ? model.top_p?.max : 1}
        />

        {model.value.includes("gpt") && (
          <Fragment>
            <SlideAndNumField
              name="frequency_penalty"
              title="Frequency penalty"
              min={
                model.frequency_penalty?.min ? model.frequency_penalty?.min : 0
              }
              max={
                model.frequency_penalty?.min ? model.frequency_penalty?.max : 2
              }
            />
            <SlideAndNumField
              name="presence_penalty"
              title="Presence penalty"
              min={
                model.presence_penalty?.min ? model.presence_penalty?.min : 0
              }
              max={
                model.presence_penalty?.min ? model.presence_penalty?.max : 2
              }
            />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Advance;
