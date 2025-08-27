import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '../hooks/useContent';
import { SmtVideo } from '../types';
import { PlayIcon } from '../components/icons';
import WavySeparator from '../components/WavySeparator';

const getYouTubeEmbedUrl = (url: string, autoplay: boolean = false) => {
    if (!url) return null;
    try {
        const videoUrl = new URL(url);
        let videoId = videoUrl.searchParams.get('v');
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?rel=0${autoplay ? '&autoplay=1' : ''}`;
        }
        if (videoUrl.hostname === 'youtu.be') {
            videoId = videoUrl.pathname.slice(1);
            return `https://www.youtube.com/embed/${videoId}?rel=0${autoplay ? '&autoplay=1' : ''}`;
        }
    } catch (error) {
        console.error("Invalid YouTube URL", error);
        return null;
    }
    return null;
};

const VideoModal: React.FC<{ videoUrl: string, onClose: () => void }> = ({ videoUrl, onClose }) => {
    const embedUrl = getYouTubeEmbedUrl(videoUrl, true);
    const [show, setShow] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setShow(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300); // transition duration
    };

    if (!embedUrl) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`} 
            onClick={handleClose}
        >
            <div 
                className={`relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl shadow-brand-primary/20 transition-all duration-300 ease-in-out ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} 
                onClick={(e) => e.stopPropagation()}
            >
                 <button onClick={handleClose} className="absolute -top-10 right-0 text-white text-3xl font-bold">&times;</button>
                 <iframe 
                    src={embedUrl}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                ></iframe>
            </div>
        </div>
    );
};

const useTilt = <T extends HTMLElement>() => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            const rotateY = x * 20;
            const rotateX = -y * 20;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            el.style.boxShadow = `${-x * 15}px ${-y * 15}px 30px -5px rgba(0,0,0,0.3)`;
        };

        const handleMouseLeave = () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            el.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
        };
        
        el.style.transition = 'transform 0.2s, box-shadow 0.2s';
        el.style.willChange = 'transform, box-shadow';
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return ref;
};


const VideoCard: React.FC<{ item: SmtVideo, onPlay: () => void }> = ({ item, onPlay }) => {
    const tiltRef = useTilt<HTMLDivElement>();

    return (
    <div 
        ref={tiltRef}
        onClick={onPlay}
        className="group bg-brand-surface rounded-lg overflow-hidden shadow-lg flex flex-col cursor-pointer"
    >
        <div className="aspect-w-16 aspect-h-9 overflow-hidden relative">
            <img 
                src={item.thumbnailUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayIcon className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="text-brand-primary mt-1 text-sm font-semibold">
                {item.artistName}
            </p>
            <p className="text-brand-text-secondary mt-2 text-sm flex-grow">
                {item.description}
            </p>
             <p className="mt-4 text-xs font-semibold text-brand-text-secondary">
                Released: {item.releaseDate}
            </p>
        </div>
    </div>
    )
};

const VideosPage: React.FC = () => {
    const { smtVideos } = useContent();
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

    return (
        <div className="bg-brand-bg min-h-screen">
            {playingVideoUrl && <VideoModal videoUrl={playingVideoUrl} onClose={() => setPlayingVideoUrl(null)} />}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold bg-text-gradient bg-clip-text text-transparent bg-[size:200%_auto] animate-text-gradient-flow inline-block animate-neon-glow">S.M.T. Video Productions</h1>
                    <WavySeparator />
                    <p className="text-lg text-brand-text-secondary mt-4 max-w-3xl mx-auto">
                        A dedicated gallery for the official music videos and visual productions from our roster of CoAI artists.
                    </p>
                </div>
                
                {smtVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {smtVideos.map(item => (
                            <VideoCard key={item.id} item={item} onPlay={() => setPlayingVideoUrl(item.videoUrl)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-2xl text-white">The Archive is Empty.</p>
                        <p className="text-brand-text-secondary mt-2">Check back soon for new visual productions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideosPage;