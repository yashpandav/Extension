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
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg"></div>
            <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>

            {/* Main Card */}
            <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-md border border-white/30 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent"></div>
                <div className="relative space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Compass className="w-5 h-5 text-gray-800" />
                            <h2 className="text-xl font-semibold text-gray-900">Quick Access</h2>
                        </div>
                        <button
                            onClick={handleAddShortcut}
                            className="text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-white/20"
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
                                            <span className="text-xs text-gray-700 truncate w-24 block">
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50">
                    <div className="bg-white rounded-lg mt-10 p-6 w-96 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add New Shortcut</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitNewSite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                                <input
                                    type="text"
                                    value={newSite.title}
                                    onChange={(e) => setNewSite({ ...newSite, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
                                <input
                                    type="url"
                                    value={newSite.url}
                                    onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add Shortcut
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopSites;
