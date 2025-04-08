import React, { useState } from "react";
import { Button } from "../ui/button";
import { BarChart, Check } from "lucide-react";
import { PollOption as PollOptionType } from "../../types/interactive";
import { cn } from "../../lib/utils";

interface PollElementProps {
  id: string;
  question: string;
  options: PollOptionType[];
  showResults: boolean;
  isVisible: boolean;
}

export function PollElement({
  id,
  question,
  options,
  showResults: initialShowResults,
  isVisible,
}: PollElementProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(initialShowResults);
  const [pollOptions, setPollOptions] = useState<PollOptionType[]>(options);

  if (!isVisible) return null;

  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = (optionId: string) => {
    if (selectedOption) return; // Prevent multiple votes

    setSelectedOption(optionId);
    setPollOptions(
      pollOptions.map((option) =>
        option.id === optionId ? { ...option, votes: option.votes + 1 } : option
      )
    );
    setShowResults(true);
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div
      className="p-4 rounded-lg bg-slate-800/50 w-full max-w-md"
      data-interactive-id={id}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart className="h-5 w-5 text-purple-400" />
        <h3 className="font-medium text-white">{question}</h3>
      </div>

      <div className="space-y-2">
        {pollOptions.map((option) => (
          <div key={option.id} className="relative">
            <Button
              variant={selectedOption === option.id ? "default" : "outline"}
              className={cn(
                "w-full justify-start h-auto py-3 px-4 text-left",
                selectedOption === option.id
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-slate-600 hover:bg-slate-700",
                showResults && "pr-16"
              )}
              onClick={() => handleVote(option.id)}
              disabled={!!selectedOption}
            >
              <div className="flex items-center gap-2">
                {selectedOption === option.id && (
                  <Check className="h-4 w-4 text-white" />
                )}
                <span>{option.text}</span>
              </div>
            </Button>

            {showResults && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium">
                {getPercentage(option.votes)}%
              </div>
            )}

            {showResults && (
              <div
                className="absolute left-0 bottom-0 h-1 bg-blue-500 rounded-b-md"
                style={{ width: `${getPercentage(option.votes)}%` }}
              />
            )}
          </div>
        ))}
      </div>

      {showResults && (
        <div className="mt-3 text-xs text-slate-400 text-right">
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

export type { PollOptionType as PollOption };
