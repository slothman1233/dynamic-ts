declare class SPSParser {
    static _ebsp2rbsp(uint8array: any): Uint8Array;
    static parseSPS(uint8array: any): {
        profile_string: string;
        level_string: string;
        bit_depth: number;
        chroma_format: number;
        chroma_format_string: string;
        frame_rate: {
            fixed: boolean;
            fps: number;
            fps_den: number;
            fps_num: number;
        };
        sar_ratio: {
            width: number;
            height: number;
        };
        codec_size: {
            width: number;
            height: number;
        };
        present_size: {
            width: number;
            height: number;
        };
    };
    static _skipScalingList(gb: any, count: any): void;
    static getProfileString(profile_idc: any): "Baseline" | "Main" | "Extended" | "High" | "High10" | "High422" | "High444" | "Unknown";
    static getLevelString(level_idc: any): string;
    static getChromaFormatString(chroma: any): "Unknown" | "4:2:0" | "4:2:2" | "4:4:4";
}
export default SPSParser;
