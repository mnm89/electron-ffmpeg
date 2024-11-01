/* SystemJS module definition */
// eslint-disable-next-line no-var
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  electronAPI: {
    onMediaFileSaved: (callback: (filePath: string) => Promise<void>) => void;
    onMediaFileProgress: (callback: (progress: any) => Promise<void>) => void;
    onMediaFileError: (callback: (error: any) => Promise<void>) => void;
    getVideos: () => Promise<string[]>;
  };
}
