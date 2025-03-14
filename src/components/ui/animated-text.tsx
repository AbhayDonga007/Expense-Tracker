import React from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
}

export function AnimatedText({ text }: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState(0);

  React.useEffect(() => {
    if (cursorPosition < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[cursorPosition]);
        setCursorPosition((prev) => prev + 1);
      }, 30); // Adjust typing speed here

      return () => clearTimeout(timeout);
    }
  }, [cursorPosition, text]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono text-blue-400 font-bold"
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1] }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          repeatType: "reverse",
        }}
        className="inline-block w-0.5 h-5 bg-default-600 ml-0.5"
      />
    </motion.div>
  );
}