"use client";

interface SearchInterfaceProps {
  query: string;
  setQuery: (query: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
  showResults: boolean;
}

export default function SearchInterface({ 
  query, 
  setQuery, 
  textareaRef, 
  handleKeyDown,
  isSearching,
  showResults
}: SearchInterfaceProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mt-1">
        <span className="text-sm">👤</span>
      </div>
      
      <div className="flex-1">
        <h2 className="text-xl font-medium mb-2">Who are you looking to reach out today?</h2>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
            placeholder="Describe your target audience..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          {!isSearching && !showResults && (
            <div className="absolute bottom-4 right-4 text-sm text-gray-500">
              Press Enter to search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}