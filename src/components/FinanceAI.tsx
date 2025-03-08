import React from "react";
import { AnimatedText } from "./ui/animated-text";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BrainIcon } from "lucide-react";

type Props = {
    text: string
};

const FinanceAI = ({text}: Props) => {
  return (
    <div>
      <Card className="items-center mt-3 justify-between p-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div>
            <BrainIcon className="text-white bg-[#f31260] p-1 w-[40px] h-[40px] rounded-full" />
            </div>
            <CardTitle className="text-[20px] font-semibold">
              Finance Smart AI
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatedText text={text} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceAI;
