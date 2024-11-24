import React, { FormEvent, useState, useEffect, useRef } from "react";
import {
  Search as SearchIcon,
  MessageSquare,
  Youtube,
  Newspaper,
  History,
  X,
  ArrowRight,
  ChevronRight,
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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
      color: "text-blue-500",
    },
    {
      text: "Ask ChatGPT",
      icon: <MessageSquare className="w-4 h-4" />,
      type: "chatgpt",
      color: "text-green-500",
    },
    {
      text: "Search YouTube",
      icon: <Youtube className="w-4 h-4" />,
      type: "youtube",
      color: "text-red-500",
    },
    {
      text: "Search News",
      icon: <Newspaper className="w-4 h-4" />,
      type: "news",
      color: "text-purple-500",
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
        handleSearch(e as any, "google", selectedItem);
      }
    } else if (e.key === " " && selectedIndex !== -1) {
      e.preventDefault();
      const selectedItem = items[selectedIndex];
      if (!searchTypes.some((type) => type.text === selectedItem)) {
        handleSuggestionClick(selectedItem, true);
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

  const handleSuggestionClick = (suggestion: string, onlyAddToSearchBar: boolean = false) => {
    setQuery(suggestion);
    if (!onlyAddToSearchBar) {
      handleSearch({ preventDefault: () => {} } as FormEvent, "google", suggestion);
    }
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-50" ref={searchRef}>
      <form onSubmit={(e) => handleSearch(e)} className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setShowHistory(false);
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search the web..."
          className={` 
              w-full py-4 pl-14 pr-32
              text-lg
              transition-[background-color, box-shadow, color, placeholder-color] duration-300 ease-in-out
              ${isFocused ? "bg-white shadow-2xl" : "bg-white/20"}
              ${isFocused || query ? "placeholder-gray-500" : "placeholder-gray-300"}
              ${isFocused ? "text-gray-900" : "text-gray-300"}
              ${showSuggestions || showHistory ? "rounded-t-2xl" : "rounded-2xl"}
              focus:outline-none
          `}
        />

        <SearchIcon
          className={`absolute left-5 top-1/2 transform -translate-y-1/2 
                    ${isFocused ? "text-gray-500" : "text-white/70"} 
                    w-6 h-6 transition-colors duration-200`}
        />

        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
          {query && (
            <button
              type="button"
              onClick={(e) => handleSearch(e)}
              className={`p-2 rounded-lg transition-colors
                ${isFocused ? "text-gray-500" : "text-white/70"}
                hover:bg-gray-100 hover:text-slate-600 active:scale-95
              `}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowHistory(!showHistory);
              setShowSuggestions(false);
              setSelectedIndex(-1);
              setIsFocused(true);
            }}
            className={`p-2 rounded-lg transition-all duration-200
              ${isFocused ? "text-gray-500" : "text-white/70"}
              hover:bg-gray-100 hover:text-gray-600 active:scale-95`}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (searchSuggestions.length > 0 || query.trim()) && !showHistory && (
        <div className="absolute w-full bg-white rounded-b-2xl shadow-2xl border-t border-gray-100 overflow-hidden z-50">
          {searchSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-6 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between
                text-gray-800 group
                ${selectedIndex === index ? "bg-gray-50 text-gray-900" : "hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <div 
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center gap-3 flex-grow"
              >
                <SearchIcon
                  className={`w-4 h-4 text-gray-400 transition-colors
                    ${selectedIndex === index ? "text-blue-500" : "group-hover:text-blue-500"}`}
                />
                <span
                  className={`transition-colors ${selectedIndex === index ? "text-blue-600" : "group-hover:text-blue-600"}`}
                >
                  {suggestion}
                </span>
              </div>
              <button
                onClick={() => handleSuggestionClick(suggestion, true)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Search Type Options */}
          <div className="border-t border-gray-100">
            {searchTypes.map((type, index) => (
              <div
                key={index}
                onClick={(e) => handleSearch(e as any, type.type)}
                className={`px-6 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3
                  text-gray-800 group
                  ${selectedIndex === searchSuggestions.length + index
                    ? "bg-gray-50 text-gray-900"
                    : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {React.cloneElement(type.icon, {
                  className: `${type.color} transition-transform group-hover:scale-110`,
                })}
                <span
                  className={`transition-colors ${selectedIndex === searchSuggestions.length + index
                    ? "text-gray-900"
                    : "group-hover:text-gray-900"
                    }`}
                >
                  {type.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search History */}
      {showHistory && (
        <div className="absolute w-full bg-white rounded-b-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
            <span className="text-gray-500 text-sm font-medium">Recent Searches</span>
            <button
              onClick={clearHistory}
              className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" /> Clear All
            </button>
          </div>
          {searchHistory.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              No recent searches
            </div>
          ) : (
            searchHistory.map((item, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors text-gray-800 hover:bg-gray-50"
              >
                <div
                  onClick={() => {
                    setQuery(item);
                    setShowHistory(false);
                  }}
                  className="flex-grow flex items-center gap-3 cursor-pointer"
                >
                  <History className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span className="group-hover:text-blue-600">{item}</span>
                </div>
                <button
                  onClick={() => {
                    const updatedHistory = searchHistory.filter(
                      (historyItem, idx) => idx !== index
                    );
                    setSearchHistory(updatedHistory);
                    localStorage.setItem(
                      "searchHistory",
                      JSON.stringify(updatedHistory)
                    );
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search;