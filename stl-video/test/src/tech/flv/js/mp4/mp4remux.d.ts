/**
 * 代码借鉴了flv.js
 * 增加了自己的注释和写法
 */
declare class MP4 {
    static init(): void;
    /**
     * 封装box
     */
    static box(type: any): Uint8Array;
    static generateInitSegment(meta: any): Uint8Array;
    static moov(meta: any): any;
    static mvhd(timescale: any, duration: any): any;
    static trak(meta: any): any;
    static tkhd(meta: any): any;
    /**
     * “mdia”也是个container box，其子box的结构和种类还是比较复杂的。先来看一个“mdia”的实例结构树图。
     * 总体来说，“mdia”定义了track媒体类型以及sample数据，描述sample信息。一般“mdia”包含一个“mdhd”，
     * 一个“hdlr”和一个“minf”，其中“mdhd”为media header box，“hdlr”为handler reference box，
     * “minf”为media information box。
     *
     * mdia
     * 		mdhd
     * 		hdlr
     * 		minf
     * 			smhd
     * 			dinf
     * 				dref
     * 					url
     * 			stbl
     * 				stsd
     * 					mp4a
     * 						esds
     * 				stts
     * 				stsc
     * 				stsz
     * 				stco
     */
    static mdia(meta: any): any;
    static mdhd(meta: any): any;
    static hdlr(meta: any): any;
    /**
         * “minf”存储了解释track媒体数据的handler-specific信息，media handler用这些信息将媒体时间映射到媒体数据并进行处理。“minf”中的信息格式和内容与媒体类型以及解释媒体数据的media handler密切相关，其他media handler不知道如何解释这些信息。“minf”是一个container box，其实际内容由子box说明。
    一般情况下，“minf”包含一个header box，一个“dinf”和一个“stbl”，其中，header box根据track type（即media handler type）分为“vmhd”、“smhd”、“hmhd”和“nmhd”，“dinf”为data information box，“stbl”为sample table box。下面分别介绍。

         *
         */
    static minf(meta: any): any;
    /**
     * Data Information Box
     * “dinf”解释如何定位媒体信息，是一个container box。“dinf”一般包含一个“dref”，即data reference box；
     * “dref”下会包含若干个“url”或“urn”，这些box组成一个表，用来定位track数据。
     * 简单的说，track可以被分成若干段，每一段都可以根据“url”或“urn”指向的地址来获取数据，
     * sample描述中会用这些片段的序号将这些片段组成一个完整的track。
     * 一般情况下，当数据被完全包含在文件中时，“url”或“urn”中的定位字符串是空的。
     */
    static dinf(): any;
    /**
         * Sample Table Box（stbl）
        *	“stbl”几乎是普通的MP4文件中最复杂的一个box了，首先需要回忆一下sample的概念。
        * 	sample是媒体数据存储的单位，存储在media的chunk中，chunk和sample的长度均可互不相同，如下图所示。
            “stbl”是一个container box，其子box包括：sample description box（stsd）、
             * time to sample box（stts）、sample size box（stsz或stz2）、
             * sample to chunk box（stsc）、chunk offset box（stco或co64）、
             * composition time to sample box（ctts）、sync sample box（stss）
             * stsd”必不可少，且至少包含一个条目，该box包含了data reference box进行sample数据检索的信息。
             * 没有“stsd”就无法计算media sample的存储位置。“stsd”包含了编码的信息，其存储的信息随媒体类型不同而不同。
             * 			stbl
             * 				stsd
             * 					avc1
             * 						avcC
             * 				stts
             * 				stsc
             * 				stsz
             * 				stco
         */
    static stbl(meta: any): any;
    /**
         * Sample Description Box（stsd）
            box header和version字段后会有一个entry count字段，
 * 			根据entry的个数，每个entry会有type信息，如“vide”、“sund”等，
 * 		根据type不同sample description会提供不同的信息，例如对于video track，
 * 会有“VisualSampleEntry”类型信息，对于audio track会有“AudioSampleEntry”类型信息。

         * * 				stsd
            * 					mp4a
            * 						esds
             *
             *
             *
             *
             * 		 4 bytes - length in total
                     4 bytes - 4 char code of sample description table (stsd)
                     4 bytes - version & flags
                     4 bytes - number of sample entries (num_sample_entries)
                         [
                            4 bytes - length of sample entry (len_sample_entry)
                            4 bytes - 4 char code of sample entry
                            ('len_sample_entry' - 8) bytes of data
                         ] (repeated 'num_sample_entries' times)
                    (4 bytes - optional 0x00000000 as end of box marker )
         */
    static stsd(meta: any): any;
    static mp4a(meta: any): any;
    static esds(meta: any): any;
    /**
     * 改版
     *stsd下的avc1视频解析
     */
    static avc1(meta: any): any;
    static mvex(meta: any): any;
    static trex(meta: any): any;
    static moof(track: any, baseMediaDecodeTime: any): any;
    static mfhd(sequenceNumber: any): any;
    static traf(track: any, baseMediaDecodeTime: any): any;
    static sdtp(track: any): any;
    static trun(track: any, offset: any): any;
    static mdat(data: any): any;
}
export default MP4;
