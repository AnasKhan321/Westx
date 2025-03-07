import { useState, useEffect, useRef } from 'react';

interface Reaction {
  emoji: string;
  label: string;
}

interface ReactionPopupProps {
  onSelect: (reaction: string) => void;
}

const reactions: Reaction[] = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" }
];

const ReactionPopup = ({ onSelect }: ReactionPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const popupRef = useRef<HTMLDivElement>(null);

  const showPopup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const hidePopup = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setHoveredIndex(null);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        onMouseEnter={showPopup}
        onMouseLeave={hidePopup}
        className="flex items-center space-x-1 hover:bg-gray-100 px-3 py-2 rounded-full"
      >
        <span className="text-xl">👍</span>
        <span>Like</span>
      </button>

      {isVisible && (
        <div
          ref={popupRef}
          onMouseEnter={showPopup}
          onMouseLeave={hidePopup}
          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg px-2 py-1 flex items-center space-x-1 transition-all duration-200"
        >
          {reactions.map((reaction, index) => (
            <button
              key={reaction.label}
              onClick={() => {
                onSelect(reaction.emoji);
                setIsVisible(false);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group p-2 hover:scale-125 transition-transform duration-200"
            >
              <span className="text-2xl">{reaction.emoji}</span>
              {hoveredIndex === index && (
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap">
                  {reaction.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionPopup;