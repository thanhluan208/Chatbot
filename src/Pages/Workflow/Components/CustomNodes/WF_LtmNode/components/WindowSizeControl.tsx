import React, { useState } from 'react';
import SwitchButton from './SwitchButton'; // Import SwitchButton
import { min } from 'lodash';

interface WindowSizeControlProps {
    min: number;
    max: number;
    handleUpdate?: (history_turn: number) => Promise<void>;
  }

const WindowSizeControl : React.FC<WindowSizeControlProps> = ({ min, max, handleUpdate }) => {
  const [isOn, setIsOn] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  const handleSliderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    var value = parseInt(e.target.value, 10);
    setSliderValue(value);

    if (handleUpdate) {
      await handleUpdate(value);
    }
  };

  return (
    <div className='flex items-center gap-5 ml-9'
    style={{fontFamily: "SegoeUI"}}>
      <SwitchButton isOn={isOn} toggleSwitch={toggleSwitch} />

      <label style={{marginLeft: "-9px"}}>WINDOW SIZE</label>

      <input
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleSliderChange}
        disabled={!isOn}
        style={{
          opacity: isOn ? 1 : 0.5,
          cursor: isOn ? 'pointer' : 'not-allowed',
        }}
      />

      <input
        type="number"
        value={sliderValue}
        readOnly
        className='w-12 text-center rounded-[5px]'
        style={{
          opacity: isOn ? 1 : 0.5,
          backgroundColor: '#c8ceda24'
        }}
        disabled={!isOn}
      />
    </div>
  );
};

export default WindowSizeControl;
