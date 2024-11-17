import React, { FormEvent } from "react";
import {
  Search as SearchIcon,
  MessageSquare,
  Youtube,
  Newspaper,
} from "lucide-react";
import { useState, useEffect } from "react";

export const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<
    Array<{
      text: string;
      icon: React.ReactNode;
      type: string;
    }>
  >([]);

  const handleSearch = (e: FormEvent, type?: string) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Redirect based on the suggestion type
    switch (type) {
      case "chatgpt":
        window.location.href = `https://chat.openai.com/?q=${encodeURIComponent(
          query
        )}`;
        break;
      case "youtube":
        window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(
          query
        )}`;
        break;
      case "news":
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          query
        )}+news`;
        break;
      default:
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          query
        )}`;
        break;
    }
  };

  useEffect(() => {
    if (query.trim()) {
      setSuggestions([
        {
          text: `${query} :ask chatgpt`,
          icon: <MessageSquare className="w-4 h-4" />,
          type: "chatgpt",
        },
        {
          text: `${query} :ask youtube`,
          icon: <Youtube className="w-4 h-4" />,
          type: "youtube",
        },
        {
          text: `${query} :news`,
          icon: <Newspaper className="w-4 h-4" />,
          type: "news",
        },
      ]);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div className="w-full relative">
      <form onSubmit={(e) => handleSearch(e)} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web..."
          className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/20 backdrop-blur-xl 
                    text-white placeholder-white/70 text-lg
                    focus:outline-none focus:ring-2 focus:ring-white/50 
                    shadow-lg transition-all duration-200
                    border border-white/10"
        />
        <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
      </form>

      {suggestions.length > 0 && (
        <div
          className="absolute w-full mt-2 bg-white/20 backdrop-blur-xl rounded-xl 
                      shadow-lg border border-white/10 overflow-hidden"
        >
          {suggestions.map((suggestion, index) => (
            <a
              key={index}
              href="#"
              onClick={(e) => handleSearch(e, suggestion.type)}
              className="flex items-center gap-3 px-6 py-3 hover:bg-white/30 
                        transition-colors text-white/90"
            >
              {suggestion.icon}
              <span>{suggestion.text}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
