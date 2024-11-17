import React from 'react';
import { Compass } from 'lucide-react';

interface Site {
    title: string;
    url: string;
}

export const TopSites = () => {
    const [sites, setSites] = React.useState<Site[]>([]);

    React.useEffect(() => {
        const fetchTopSites = async () => {
            try {
                if (!chrome?.topSites) return;
                const topSites = await chrome.topSites.get();
                setSites(topSites.slice(0, 8));
            } catch (error) {
                console.error('Error fetching top sites:', error);
            }
        };
        fetchTopSites();
    }, []);

    return (
        <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Compass className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-800">Most Visited</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {sites.map((site, index) => (
                    <a
                        key={index}
                        href={site.url}
                        className="group flex flex-col items-center p-3 rounded-lg hover:bg-white/40 transition-all duration-200"
                    >
                        <div className="w-12 h-12 mb-2 rounded-full bg-white/60 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=32`}
                                alt=""
                                className="w-6 h-6"
                            />
                        </div>
                        <span className="text-sm text-center text-gray-700 font-medium truncate w-full">
                            {site.title}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
};