import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar produtos, lojas...",
  suggestions = [],
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-12 h-8 w-8 p-0"
            onClick={() => {
              setQuery("");
              setShowSuggestions(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          className="absolute right-1 h-8"
          size="sm"
          onClick={handleSearch}
        >
          Buscar
        </Button>
      </div>

      {/* Sugestões */}
      {showSuggestions && query && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
                setShowSuggestions(false);
              }}
            >
              <Search className="mr-2 inline h-4 w-4 text-gray-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
