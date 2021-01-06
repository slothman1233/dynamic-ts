/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable */
class MediaInfo {
    mimeType :any= null;
    duration :any= null;

    hasAudio :any= null;
    hasVideo :any= null;
    audioCodec :any= null;
    videoCodec :any= null;
    audioDataRate :any= null;
    videoDataRate :any= null;

    audioSampleRate :any= null;
    audioChannelCount :any= null;

    width :any= null;
    height :any= null;
    fps :any= null;
    profile :any= null;
    level :any= null;
    chromaFormat :any= null;
    sarNum :any= null;
    sarDen :any= null;

    metadata :any= null;
    segments :any= null; // MediaInfo[]
    segmentCount :any= null;
    hasKeyframesIndex :any= null;
    keyframesIndex :any= null;
    constructor() {
  
    }

    isComplete() {
        const audioInfoComplete = (this.hasAudio === false) ||
            (this.hasAudio === true &&
                this.audioCodec != null &&
                this.audioSampleRate != null &&
                this.audioChannelCount != null);

        const videoInfoComplete = (this.hasVideo === false) ||
            (this.hasVideo === true &&
                this.videoCodec != null &&
                this.width != null &&
                this.height != null &&
                this.fps != null &&
                this.profile != null &&
                this.level != null &&
                this.chromaFormat != null &&
                this.sarNum != null &&
                this.sarDen != null);

        // keyframesIndex may not be present
        return this.mimeType != null &&
            this.duration != null &&
            this.metadata != null &&
            this.hasKeyframesIndex != null &&
            audioInfoComplete &&
            videoInfoComplete;
    }

    isSeekable() {
        return this.hasKeyframesIndex === true;
    }
}

export default MediaInfo;