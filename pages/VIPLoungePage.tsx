

import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';
import * as ReactRouterDOM from 'react-router-dom';
import { SubscriptionTier, DisplayTrack, SubmissionStatus, StudioSubmission } from '../types';
import { VIP_RELEASES } from '../constants';
import { CrownIcon, StarIcon, PlayIcon, DownloadIcon, MessageCircleIcon } from '../components/icons';

const TabButton: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            active ? 'bg-brand-primary text-white' : 'text-brand-text-secondary hover:bg-brand-surface hover:text-white'
        }`}
    >
        {label}
    </button>
);

const ReleaseCard: React.FC<{ release: DisplayTrack }> = ({ release }) => (
    <div className="bg-brand-surface rounded-lg p-4 group flex flex-col">
        <div className="relative mb-4">
            <img src={release.imageUrl} alt={release.title} className="w-full h-40 object-cover rounded-md" />
            {release.isNew && <div className="absolute top-2 left-2 bg-yellow-400 text-brand-dark text-xs font-bold px-2 py-1 rounded">NEW</div>}
        </div>
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-white">{release.title}</h3>
            <p className="text-sm text-brand-text-secondary mb-1">{release.artist}</p>
            <p className="text-xs text-brand-primary">{release.type}</p>
        </div>
        <div className="flex items-center justify-end space-x-2 mt-4">
             <a href={release.sourceUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-yellow-500/20 text-yellow-400 p-2 rounded-full hover:bg-yellow-500 hover:text-black transition-colors">
                <PlayIcon className="w-5 h-5"/>
            </a>
            <button className="bg-brand-surface/80 text-brand-text-secondary p-2 rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                <DownloadIcon className="w-5 h-5"/>
            </button>
        </div>
    </div>
);

const ShowcaseCard: React.FC<{ submission: StudioSubmission }> = ({ submission }) => (
    <div className="bg-brand-surface rounded-lg p-6 group flex flex-col">
        <div className="flex-grow mb-4">
             <p className="text-sm text-brand-accent">"{submission.prompt}"</p>
             <h3 className="text-xl font-bold text-white mt-2">Generated Idea</h3>
             <p className="text-brand-text-secondary text-sm mt-2 font-light line-clamp-4">{submission.generatedIdea}</p>
        </div>
        <div className="border-t border-brand-primary/20 pt-4">
            <p className="text-sm font-semibold text-white">By: {submission.userName}</p>
            {submission.curatorComment && (
                <div className="mt-3 text-xs text-brand-text-secondary italic bg-brand-dark/50 p-2 rounded-md">
                    <span className="font-bold not-italic text-brand-primary">Curator's Note:</span> {submission.curatorComment}
                </div>
            )}
        </div>
    </div>
);

const VIPLoungePage: React.FC = () => {
  const { user } = useAuth();
  const { studioSubmissions } = useContent();
  const [activeTab, setActiveTab] = useState('releases');

  const showcasedSubmissions = useMemo(() => {
      return studioSubmissions.filter(s => s.status === SubmissionStatus.SHOWCASED);
  }, [studioSubmissions]);

  if (!user || user.tier !== SubscriptionTier.VIP) {
    return <ReactRouterDOM.Navigate to="/signin" replace />;
  }

  return (
    <div className="bg-brand-bg min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            Welcome to your exclusive space, <span className="text-yellow-400">{user.name}</span>
          </h1>
          <div className="inline-block bg-brand-surface mt-6 px-6 py-3 rounded-lg border border-yellow-400/50">
              <p className="text-yellow-400 font-bold">VIP Member Since</p>
              <p className="text-white text-lg">{user.memberSince}</p>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-2 bg-brand-dark p-2 rounded-xl mb-12 max-w-3xl mx-auto">
          <TabButton label="Exclusive Releases" active={activeTab === 'releases'} onClick={() => setActiveTab('releases')} />
          <TabButton label="Creator's Showcase" active={activeTab === 'showcase'} onClick={() => setActiveTab('showcase')} />
          <TabButton label="VIP Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <TabButton label="VIP Chat Rooms" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <TabButton label="Behind the Scenes" active={activeTab === 'bts'} onClick={() => setActiveTab('bts')} />
        </div>

        <div>
          {activeTab === 'releases' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Exclusive Releases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {VIP_RELEASES.map(release => <ReleaseCard key={release.id} release={release} />)}
              </div>
            </div>
          )}
           {activeTab === 'showcase' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Creator's Showcase</h2>
              {showcasedSubmissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {showcasedSubmissions.map(sub => <ShowcaseCard key={sub.id} submission={sub} />)}
                </div>
              ) : (
                <div className="text-center py-20 bg-brand-surface rounded-lg">
                    <h3 className="text-2xl text-white">The Stage is Waiting</h3>
                    <p className="text-brand-text-secondary mt-2">No creations have been showcased yet. Be the first!</p>
                </div>
              )}
            </div>
          )}
          {activeTab !== 'releases' && activeTab !== 'showcase' &&(
            <div className="text-center py-20 bg-brand-surface rounded-lg">
              <h3 className="text-2xl text-white">Coming Soon!</h3>
              <p className="text-brand-text-secondary mt-2">This area is under construction. Stay tuned for updates.</p>
            </div>
          )}
        </div>

        <div className="mt-20 bg-brand-surface/50 p-8 rounded-lg text-center">
            <CrownIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-6">Your VIP Benefits</h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-yellow-400">
                <div className="flex items-center space-x-2">
                    <StarIcon className="w-5 h-5"/>
                    <span>Exclusive releases & content</span>
                </div>
                 <div className="flex items-center space-x-2">
                    <StarIcon className="w-5 h-5"/>
                    <span>Priority event access</span>
                </div>
                 <div className="flex items-center space-x-2">
                    <MessageCircleIcon className="w-5 h-5"/>
                    <span>Direct artist communication</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VIPLoungePage;
