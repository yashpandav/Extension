import React, { FormEvent, useState, useEffect, useRef } from "react";
import {
  Search as SearchIcon,
  MessageSquare,
  Youtube,
  Newspaper,
  History,
  X,
  ArrowRight,
  Keyboard,
} from "lucide-react";

export const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowHistory(false);
        setSelectedIndex(-1);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && isFocused) {
        setQuery("");
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isFocused]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim()) {
        try {
          const response = await fetch(
            `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${query}&limit=4&format=json`
          );
          const data = await response.json();
          setSearchSuggestions(data[1] || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSearchSuggestions([]);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchTypes = [
    {
      text: "Search Google",
      icon: <SearchIcon className="w-4 h-4" />,
      type: "google",
    },
    {
      text: "Ask ChatGPT",
      icon: <MessageSquare className="w-4 h-4" />,
      type: "chatgpt",
    },
    {
      text: "Search YouTube",
      icon: <Youtube className="w-4 h-4" />,
      type: "youtube",
    },
    {
      text: "Search News",
      icon: <Newspaper className="w-4 h-4" />,
      type: "news",
    },
  ];

  const getAllItems = () => [
    ...searchSuggestions,
    ...searchTypes.map((type) => type.text),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = getAllItems();

    if (!showSuggestions || items.length === 0) return;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      e.preventDefault();
      const selectedItem = items[selectedIndex];
      if (searchTypes.some((type) => type.text === selectedItem)) {
        handleSearch(
          e as any,
          searchTypes.find((type) => type.text === selectedItem)?.type
        );
      } else {
        handleSuggestionClick(selectedItem);
      }
    }
  };

  const handleSearch = (
    e: FormEvent,
    type: string = "google",
    suggestion?: string
  ) => {
    e.preventDefault();
    const searchQuery = suggestion || query;
    if (!searchQuery.trim()) return;

    const newHistory = [searchQuery, ...searchHistory.slice(0, 9)];
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    const urls = {
      google: `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`,
      chatgpt: `https://chat.openai.com/?q=${encodeURIComponent(searchQuery)}`,
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        searchQuery
      )}`,
      news: `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}+news`,
    };

    window.location.href = urls[type as keyof typeof urls];
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
    setShowHistory(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-50" ref={searchRef}>
      <form onSubmit={(e) => handleSearch(e)} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setShowHistory(false);
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search the web..."
          className={`w-full px-6 py-4 pl-14 pr-32 rounded-2xl 
                    ${isFocused || query ? "bg-white/95" : "bg-white/20"} 
                    backdrop-blur-xl 
                    ${isFocused || query ? "text-gray-800" : "text-white"}
                    ${
                      isFocused || query
                        ? "placeholder-gray-500"
                        : "placeholder-white/70"
                    }
                    text-lg
                    focus:outline-none focus:ring-2 focus:ring-white/50 
                    shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                    border border-white/10`}
        />
        <SearchIcon
          className={`absolute left-5 top-1/2 transform -translate-y-1/2 
                    ${isFocused || query ? "text-gray-500" : "text-white/70"} 
                    w-6 h-6 transition-colors duration-200`}
        />

        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => handleSearch(e)}
            className={`p-2 hover:bg-gray-200 rounded-lg transition-colors
                     ${isFocused || query ? "text-gray-500" : "text-white/70"}`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setShowHistory(!showHistory);
              setShowSuggestions(false);
              setSelectedIndex(-1);
            }}
            className={`p-2 hover:bg-gray-200 rounded-lg transition-colors
                     ${isFocused || query ? "text-gray-500" : "text-white/70"}`}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions &&
        (searchSuggestions.length > 0 || query.trim()) &&
        !showHistory && (
          <div
            className="absolute w-full mt-2 bg-white/95 
                       rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                       border border-white/10 
                       overflow-hidden z-50"
          >
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-6 py-3 cursor-pointer transition-colors flex items-center gap-3
                         text-gray-800
                         ${
                           selectedIndex === index
                             ? "bg-gray-100"
                             : "hover:bg-gray-50"
                         }`}
              >
                <SearchIcon className="w-4 h-4 text-gray-500" />
                <span>{suggestion}</span>
              </div>
            ))}
            {/* Search Type Options */}
            <div className="border-t border-gray-200">
              {searchTypes.map((type, index) => (
                <div
                  key={index}
                  onClick={(e) => handleSearch(e as any, type.type)}
                  className={`px-6 py-3 cursor-pointer transition-colors flex items-center gap-3
                           text-gray-800
                           ${
                             selectedIndex === searchSuggestions.length + index
                               ? "bg-gray-100"
                               : "hover:bg-gray-50"
                           }`}
                >
                  {React.cloneElement(type.icon, {
                    className: "text-gray-500",
                  })}
                  <span>{type.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Search History */}
      {showHistory && (
        <div
          className="absolute w-full mt-2 bg-white/95 
                       rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                       border border-white/10 
                       overflow-hidden z-50"
        >
          <div
            className="flex items-center justify-between px-4 py-2 
                         border-b border-gray-200"
          >
            <span className="text-gray-500 text-sm">Recent Searches</span>
            <button
              onClick={clearHistory}
              className="text-gray-400 hover:text-gray-600 text-sm 
                         flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          </div>
          {searchHistory.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setQuery(item);
                setShowHistory(false);
              }}
              className="flex items-center gap-3 px-6 py-3 
                          cursor-pointer transition-colors text-gray-800
                          hover:bg-gray-50"
            >
              <History className="w-4 h-4 text-gray-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
