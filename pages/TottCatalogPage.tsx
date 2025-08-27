import React from 'react';
import { TOTT_CATALOG_TRACKS } from '../constants';
import { DisplayTrack } from '../types';
import { PlayIcon } from '../components/icons';

const TrackCard: React.FC<{ track: DisplayTrack }> = ({ track }) => (
     <div className="bg-brand-surface/50 rounded-lg p-4 group flex flex-col hover:bg-brand-surface transition-colors duration-200">
        <div className="relative mb-4">
            <img src={track.imageUrl} alt={track.title} className="w-full h-56 object-cover rounded-md" />
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a href={track.sourceUrl} target="_blank" rel="noopener noreferrer" className="bg-brand-primary text-white p-4 rounded-full hover:bg-brand-primary/80 transition-colors">
                    <PlayIcon className="w-8 h-8" />
                </a>
             </div>
        </div>
        <div className="flex-grow">
            <h4 className="font-semibold text-white">{track.title}</h4>
            <p className="text-sm text-brand-text-secondary">{track.artist}</p>
        </div>
        {track.isPremium && <span className="mt-2 text-xs font-bold text-yellow-400 self-start">EXCLUSIVE</span>}
    </div>
);


const TottCatalogPage: React.FC = () => {
    return (
        <div className="bg-brand-bg min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold bg-text-gradient bg-clip-text text-transparent bg-[size:200%_auto] animate-text-gradient-flow inline-block">The Tip Of The Tip...</h1>
                    <p className="text-lg text-brand-text-secondary mt-4 max-w-3xl mx-auto">
                       An exclusive collection of rare cuts, experimental tracks, and unreleased gems from the S.M.T. vaults.
                    </p>
                </div>
                
                {TOTT_CATALOG_TRACKS.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {TOTT_CATALOG_TRACKS.map(track => (
                            <TrackCard key={track.id} track={track} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-2xl text-white">The catalog is currently empty.</p>
                        <p className="text-brand-text-secondary mt-2">Check back soon for exclusive content.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TottCatalogPage;