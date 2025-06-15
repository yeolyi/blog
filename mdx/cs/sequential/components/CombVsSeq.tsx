'use client';

import Button from '@/components/ui/Button';
import { Bird, Brain, LightbulbIcon, LightbulbOff } from 'lucide-react';
import { useState } from 'react';

export default function LogicCircuitsDemo() {
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-row gap-16 justify-center my-10">
      <div className="flex flex-col items-center gap-5">
        <Bulb isOn={isPressed} />
        <Button
          Icon={Bird}
          bg="gray"
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => setIsPressed(false)}
        >
          기억을 못할 때
        </Button>
      </div>

      <div className="flex flex-col items-center gap-5">
        <Bulb isOn={isToggleOn} />
        <Button
          Icon={Brain}
          bg="gray"
          onClick={() => setIsToggleOn((prev) => !prev)}
        >
          기억이 가능할 때
        </Button>
      </div>
    </div>
  );
}

const Bulb = ({ isOn }: { isOn: boolean }) => {
  return isOn ? (
    <LightbulbIcon size={50} className="stroke-yellow-500" />
  ) : (
    <LightbulbOff size={50} className="stroke-gray-500" />
  );
};
