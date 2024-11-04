import React from 'react';

interface SwitchButtonProps {
  isOn: boolean;
  toggleSwitch: () => void;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ isOn, toggleSwitch }) => {
  return (
    <label 
    className='relative inline-block w-11 h-5'>
        <input 
        type="checkbox" 
        checked={isOn} 
        onChange={toggleSwitch} 
        className='opacity-0 w-0 h-0'
        />

        <span 
        className='absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[8px]' 
        style={{ 
            backgroundColor: isOn ? '#2196F3' : '#ccc', 
            transition: '.4s',
        }}>
            <span 
                className='absolute h-4 w-4' 
                style={{ 
                    content: '""', 
                    left: isOn ? '26px' : '4px', 
                    bottom: '2px', 
                    backgroundColor: 'white', 
                    transition: '.4s', 
                    borderRadius: '50%',
                }} />
            </span>
    </label>
  );
};

export default SwitchButton;
