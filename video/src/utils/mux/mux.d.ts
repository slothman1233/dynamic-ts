

interface mux {
    codecs: {
        adts(): any
        h264(H264Stream?: any, NalByteStream?: any): any
    },
    flv: {
        getFlvHeader(duration?: any, audio?: any, video?: any): any
        tag(type?: any, extraData?: any): any
        tools(inspectTag?: any, insprct?: any, textify?: any): any
        Transmuxer(options?: any): void
    },
    mp2t: {
        ADTS_STREAM_TYPE: number
        H264_STREAM_TYPE: number
        METADATA_STREAM_TYPE: number
        MP2T_PACKET_LENGTH: number
        PAT_PID: number
        TimestampRolloverStream(type?: any): any
        TransportParseStream(): any
        TransportPacketStream(): any
        CaptionStream(): any
        Cea608Stream(field?: any, dataCannel?: any): any
        ElementaryStream(): any
        tools(insprct?: any): any
    },
    mp4: {
        AudioSegmentStream(track?: any, options?: any): any
        Transmuxer(options?: any): any
    }
}



declare var muxjs: mux