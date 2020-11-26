declare let that: typeof globalThis;
declare let BlVideo: any;
declare let option: {
    streamLink: {
        mp4: string;
    };
    mode: number;
    poster: string;
    loop: boolean;
    fullScreenDom: HTMLElement;
};
declare function play(): void;
declare function pause(): void;
declare function fullScreen(): void;
declare function muteVideo(): void;
declare function reLoad(): void;
declare function restoreVoice(): void;
declare function seek(seekpoint: any): void;
declare function changeSource(): void;
