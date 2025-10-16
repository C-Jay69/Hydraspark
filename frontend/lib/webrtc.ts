
import create from 'zustand';
import SimplePeer from 'simple-peer';

interface VideoChatState {
  peer: SimplePeer.Instance | null;
  stream: MediaStream | null;
  remoteStream: MediaStream | null;
  callStatus: 'idle' | 'calling' | 'connected' | 'disconnected';
  isMuted: boolean;
  isVideoEnabled: boolean;
  initialize: (isInitiator: boolean) => void;
  setRemoteSignal: (signal: SimplePeer.SignalData) => void;
  onSignal: (callback: (signal: SimplePeer.SignalData) => void) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
}

export const useVideoChatStore = create<VideoChatState>((set, get) => ({
  peer: null,
  stream: null,
  remoteStream: null,
  callStatus: 'idle',
  isMuted: false,
  isVideoEnabled: true,
  initialize: async (isInitiator) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const peer = new SimplePeer({
        initiator: isInitiator,
        stream: stream,
        trickle: false,
      });

      peer.on('stream', (remoteStream) => {
        set({ remoteStream, callStatus: 'connected' });
      });

      peer.on('close', () => {
        get().endCall();
      });

      peer.on('error', () => {
        get().endCall();
      });

      set({ peer, stream, callStatus: 'calling' });
    } catch (error) {
      console.error('Error initializing video chat:', error);
      set({ callStatus: 'disconnected' });
    }
  },
  setRemoteSignal: (signal) => {
    get().peer?.signal(signal);
  },
  onSignal: (callback) => {
    get().peer?.on('signal', callback);
  },
  endCall: () => {
    get().peer?.destroy();
    get().stream?.getTracks().forEach((track) => track.stop());
    set({
      peer: null,
      stream: null,
      remoteStream: null,
      callStatus: 'idle',
    });
  },
  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
    get().stream?.getAudioTracks().forEach((track) => {
      track.enabled = !get().isMuted;
    });
  },
  toggleVideo: () => {
    set((state) => ({ isVideoEnabled: !state.isVideoEnabled }));
    get().stream?.getVideoTracks().forEach((track) => {
      track.enabled = !get().isVideoEnabled;
    });
  },
}));
