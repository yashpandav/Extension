import React, { useState, useEffect } from "react";
import { Compass, ExternalLink, Plus, X, AlertTriangle } from "lucide-react";

interface Site {
    title: string;
    url: string;
    isCustom?: boolean;
}

export const TopSites = () => {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSite, setNewSite] = useState({ title: "", url: "" });
    const [isFocusedSiteName, siteNameFocused] = useState(false);
    const [isFocusedSiteUrl, siteUrlFocused] = useState(false);

    useEffect(() => {
        fetchTopSites();
    }, []);

    const fetchTopSites = async () => {
        try {
            setLoading(true);
            const savedSites = JSON.parse(localStorage.getItem("customSites") || "[]");
            let topSites: Site[] = [];

            if (chrome?.topSites) {
                const chromeSites = await chrome.topSites.get();
                topSites = chromeSites.map((site) => ({ ...site, isCustom: false }));
            } else {
                console.warn("Top Sites API not available");
            }

            setSites([...topSites.slice(0, 8), ...savedSites]);
        } catch (error) {
            setError("Unable to fetch your most visited sites.");
            console.error("Error fetching top sites:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveCustomSites = (customSites: Site[]) => {
        const topSites = sites.filter((site) => !site.isCustom);
        setSites([...topSites, ...customSites]);
        localStorage.setItem("customSites", JSON.stringify(customSites));
    };

    const handleAddShortcut = () => setShowAddModal(true);

    const handleSubmitNewSite = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSite.title && newSite.url) {
            const customSites = [...sites.filter((site) => site.isCustom), { ...newSite, isCustom: true }];
            saveCustomSites(customSites);
            setNewSite({ title: "", url: "" });
            setShowAddModal(false);
        }
    };

    const handleRemoveCustomSite = (index: number) => {
        const customSites = sites.filter((site) => site.isCustom);
        const updatedCustomSites = customSites.filter((_, i) => i !== index);
        saveCustomSites(updatedCustomSites);
    };

    const getFaviconUrl = (url: string) => {
        try {
            const hostname = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
        } catch {
            return "https://via.placeholder.com/32?text=?";
        }
    };

    const getDomainName = (url: string) => {
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch {
            return url;
        }
    };

    const handleBackdropClick = () => {
        setShowAddModal(false);
        setNewSite({ title: "", url: "" });
    };

    if (error) {
        return (
            <div className="relative">
                <div className="relative backdrop-blur-xl bg-red-100 border border-red-300 rounded-2xl p-6 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent rounded-2xl"></div>
                    <div className="relative flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <span className="font-semibold text-red-700">{error}</span>
                    </div>
                    <button
                        onClick={fetchTopSites}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Decorative Elements */}
            <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-md border border-white/30 overflow-hidden hover:shadow-lg transition-all duration-300">

                {/* Blur Effects */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg"></div>
                <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>

                <div className="relative space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Compass className="w-5 h-5 text-gray-900" />
                            <h2 className="text-xl font-semibold text-gray-900">Quick Access</h2>
                        </div>
                        <button
                            onClick={handleAddShortcut}
                            className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-800/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Shortcut</span>
                        </button>
                    </div>

                    {/* Sites Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-white/40 animate-pulse"></div>
                                    <div className="w-20 h-4 bg-white/40 rounded animate-pulse"></div>
                                </div>
                            ))
                            : sites.map((site, index) => (
                                <div
                                    key={index}
                                    className="group relative"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <a
                                        href={site.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-3 rounded-lg hover:bg-white/20 transition-all duration-200"
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 mb-2 rounded-full bg-white/60 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                                                <img
                                                    src={getFaviconUrl(site.url)}
                                                    alt=""
                                                    className="w-6 h-6"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "https://via.placeholder.com/32?text=?";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <span className="text-sm font-medium text-gray-900 truncate w-24 block">
                                                {site.title}
                                            </span>
                                            <span className="text-xs text-gray-800 truncate w-24 block">
                                                {getDomainName(site.url)}
                                            </span>
                                        </div>
                                    </a>
                                    {site.isCustom && hoveredIndex === index && (
                                        <button
                                            onClick={() => handleRemoveCustomSite(index - sites.filter((s) => !s.isCustom).length)}
                                            className="absolute top-2 right-2 text-slate-950 hover:text-gray-950"
                                            title="Remove"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Add Shortcut Modal */}
            {showAddModal && (
                <div
                    id="backdrop"
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex text-[15px] items-start justify-center z-50 transition-opacity 
                    duration-300"
                    onClick={handleBackdropClick}
                >
                    <div
                        className="bg-gray-900 text-gray-200 rounded-xl mt-16 p-8 w-[32rem] shadow-2xl relative scale-100 transform transition-transform duration-300 ease-out"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-100">Add New Shortcut</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-100 transition-colors duration-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitNewSite} className="space-y-6">
                            <div className="relative group">
                                <label className="block text-md font-medium text-gray-300 mb-2">
                                    Site Title
                                </label>
                                <div className="relative">
                                    {/* Animated Gradient Border */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 
                                                    rounded-lg 
                                                    opacity-0 group-hover:opacity-100
                                                    transition-opacity duration-300">
                                    </div>
                                    {isFocusedSiteName && (
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 
                                                        rounded-lg 
                                                        opacity-100 transition-opacity duration-300">
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        value={newSite.title}
                                        onFocus={() => siteNameFocused(true)}
                                        onBlur={() => siteNameFocused(false)}
                                        onChange={(e) => setNewSite({ ...newSite, title: e.target.value })}
                                        placeholder="Enter a site name (e.g., My Favorite Blog)"
                                        className="relative w-full px-4 py-3 
                                                bg-gray-800 text-gray-100 
                                                placeholder-gray-400 
                                                border border-transparent 
                                                rounded-lg 
                                                focus:outline-none focus:placeholder-transparent
                                                z-10 
                                                transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-md font-medium text-gray-300 mb-2">
                                    Site URL
                                </label>
                                <div className="relative">
                                    {/* Animated Gradient Border */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 
                                                    rounded-lg 
                                                    opacity-0 group-hover:opacity-100
                                                    transition-opacity duration-300">
                                    </div>
                                    {isFocusedSiteUrl && (
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 
                                                        rounded-lg 
                                                        opacity-100 transition-opacity duration-300">
                                        </div>
                                    )}
                                    <input
                                        type="url"
                                        value={newSite.url}
                                        onFocus={() => siteUrlFocused(true)}
                                        onBlur={() => siteUrlFocused(false)}
                                        onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                                        placeholder="Enter the full site URL (e.g., https://example.com)"
                                        className="relative w-full px-4 py-3 
                                                    bg-gray-800 text-gray-100 
                                                    placeholder-gray-400 
                                                    border border-transparent 
                                                    rounded-lg 
                                                    focus:outline-none focus:placeholder-transparent
                                                    z-10 
                                                    transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-5 mt-6">
                                <button
                                    type="button"
                                    onClick={handleBackdropClick}
                                    className="px-5 py-3 bg-gradient-to-r from-gray-800 to-gray-600 text-gray-300 
                                    rounded-lg hover:brightness-125 
                                    transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                                            text-white 
                                            rounded-lg 
                                            hover:brightness-110
                                            transition-all duration-300 transform"
                                >
                                    Add Shortcut
                                </button>

                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default TopSites;