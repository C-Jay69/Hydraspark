
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Video, Mic, ShareScreen } from 'lucide-react';
import { useVideoChatStore } from '@/lib/webrtc';

interface VideoChatProps {
  onEndCall: () => void;
  isInitiator: boolean;
  // This would in a real app come from a signaling server
  onSignal: (signal: any) => void;
  remoteSignal: any;
}

export default function VideoChat({ onEndCall, isInitiator, onSignal, remoteSignal }: VideoChatProps) {
  const {
    stream,
    remoteStream,
    initialize,
    setRemoteSignal,
    endCall,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoEnabled,
  } = useVideoChatStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initialize(isInitiator);
    useVideoChatStore.getState().onSignal(onSignal);
  }, [initialize, isInitiator, onSignal]);

  useEffect(() => {
    if (remoteSignal) {
      setRemoteSignal(remoteSignal);
    }
  }, [remoteSignal, setRemoteSignal]);

  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleEndCall = () => {
    endCall();
    onEndCall();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Date</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[16/9] bg-gray-900 rounded-lg flex items-center justify-center text-white">
            {stream ? (
                <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
            ) : (
                <p>Your video</p>
            )}
            </div>
            <div className="aspect-[16/9] bg-gray-900 rounded-lg flex items-center justify-center text-white">
            {remoteStream ? (
                <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover" />
            ) : (
                <p>Connecting...</p>
            )}
            </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant={isMuted ? "destructive" : "outline"} size="icon" onClick={toggleMute}>
            <Mic className="h-5 w-5" />
          </Button>
          <Button variant={isVideoEnabled ? "outline" : "destructive"} size="icon" onClick={toggleVideo}>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleEndCall}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <ShareScreen className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
