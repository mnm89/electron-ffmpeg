/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  electronAPI: {
    onMediaFileSaved: (callback: (filePath: string) => void) => void;
    selectVideo: () => string | null;
    startStreaming: (path: string) => void;
  };
}
