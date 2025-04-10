import { Loader2 } from "lucide-react";

interface SearchStageIndicatorProps {
  stage: string;
  query: string;
}

export default function SearchStageIndicator({ stage, query }: SearchStageIndicatorProps) {
  // Extract key terms from the query for more contextual messages
  const keyTerms = query.split(' ')
    .filter(word => word.length > 3)
    .slice(0, 3)
    .join(', ');
  
  const getStageMessage = () => {
    switch (stage) {
      case 'searching':
        return `Searching for leads matching "${query}"...`;
      case 'analyzing':
        return `Analyzing potential matches and qualifying leads for ${keyTerms}...`;
      case 'complete':
        return 'Search complete!';
      default:
        return 'Processing your request...';
    }
  };

  if (stage === 'complete') {
    return null; // Don't show anything when complete
  }

  return (
    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg mb-6">
      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      <p className="text-blue-700">{getStageMessage()}</p>
    </div>
  );
}