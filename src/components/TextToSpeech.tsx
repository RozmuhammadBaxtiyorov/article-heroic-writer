
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextToSpeechProps {
  text: string;
  title?: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    
    // Get available voices and set a good English voice if available
    const voices = synth.getVoices();
    const englishVoices = voices.filter(voice => voice.lang.includes('en-'));
    if (englishVoices.length > 0) {
      u.voice = englishVoices[0];
    }
    
    u.rate = 0.9; // Slightly slower than default
    u.pitch = 1.0;
    u.volume = isMuted ? 0 : 1;
    
    // Speech synthesis events
    u.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    
    u.onend = () => {
      setIsPlaying(false);
    };
    
    u.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    
    setUtterance(u);
    
    return () => {
      synth.cancel();
    };
  }, [text, isMuted]);

  // Handle when voices change (they load asynchronously)
  useEffect(() => {
    const synth = window.speechSynthesis;
    const handleVoicesChanged = () => {
      if (utterance) {
        const voices = synth.getVoices();
        const englishVoices = voices.filter(voice => voice.lang.includes('en-'));
        if (englishVoices.length > 0) {
          utterance.voice = englishVoices[0];
        }
      }
    };
    
    synth.onvoiceschanged = handleVoicesChanged;
    
    return () => {
      synth.onvoiceschanged = null;
    };
  }, [utterance]);

  const togglePlay = () => {
    const synth = window.speechSynthesis;
    
    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
    } else {
      if (!text) return;
      
      setIsLoading(true);
      synth.cancel(); // Cancel any ongoing speech
      
      if (utterance) {
        synth.speak(utterance);
      }
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (utterance) {
      utterance.volume = isMuted ? 1 : 0;
    }
  };
  
  if (!text) return null;
  
  return (
    <div className="w-full p-4 bg-gray-50 border rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Text-to-Speech</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            disabled={isLoading || !text}
            className={cn(
              "flex items-center justify-center p-3 rounded-full transition-all",
              isPlaying ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700",
              (!text) && "opacity-50 cursor-not-allowed"
            )}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className={cn(
              "flex items-center justify-center p-2 rounded-full transition-all",
              isMuted ? "bg-gray-300 text-gray-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <div className="flex-grow text-sm text-gray-600 truncate">
            {title ? title : "Generated content"}
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>Click play to listen to the generated content.</p>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
