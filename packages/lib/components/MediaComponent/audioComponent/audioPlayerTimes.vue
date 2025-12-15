<template>
  <div class="audioplayerTimes">
    <div class="player-content stop-swiping" :class="{ disabled: currentTimes > 0 && times - currentTimes < 0 }">
      <div class="icon" @click="togglePlayer">
        <img :src="paused ? require('@/assets/play.svg') : require('@/assets/pause.svg')" class="iconfont" alt="" />
      </div>
      <div class="current-time">
        {{ currentTimeStr }}
      </div>
    </div>
    <div class="error-tip" v-if="error">{{$t('transcodeTip1')}}</div>
    <div class="player-tip" v-if="currentTimes == 0 && !isQuestionBank">
      * <i18n
          path="playTimesAllowed"
          tag="span"
        >
          <template v-slot:n>
            <strong>{{ times }}</strong>
          </template>
        </i18n>
    </div>
    <div class="player-tip" v-if="currentTimes > 0 && times - currentTimes > 0 && !isQuestionBank">
      *<i18n
          path="playedTimes"
          tag="span"
        >
          <template v-slot:n>
            <strong>{{ currentTimes }}/{{ times }}</strong>
          </template>
        </i18n>
    </div>
    <div class="player-tip" v-if="currentTimes > 0 && times - currentTimes <= 0 && !isQuestionBank">
      *{{$t('playTimesOver')}}
    </div>
    <audio ref="audio" class="audioTag" preload="none" :src="getFullPath(src)" @timeupdate="timeupdate" @ended="isEnded = true"
      @pause="paused=true" @error="handleError" v-if="!error"></audio>
  </div>
</template>

<script>
import "@/components/MediaComponent/style/audioPlayerTimes.scss";
import { parseDuration } from "@/utils";
import { getFullPath } from '@/utils/file.js';

export default {
  props: {
    // 音频的src
    src: {
      type: String,
      default: "",
    },
    // 可播放的次数
    times: {
      type: Number,
      default: 1,
    },
    playedTimes: {
      type: Number,
      default: 0,
    },
    isQuestionBank: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      currentTimeStr: "00:00",
      totalTimeStr: "00:00",
      totalTime: 0,
      currentTimes: this.playedTimes,
      isEnded: true,
      paused: true,
      error: false
    };
  },
  watch: {
    playedTimes: {
      handler() {
        this.currentTimes = this.playedTimes;
      },
      immediate: true
    }
  },
  mounted() {
    const mediaInfo = this.$listeners.getMediaInfo && this.$listeners.getMediaInfo()
    if (mediaInfo) {
      const time = mediaInfo.playedTime
      this.totalTime = mediaInfo.duration || 0
      if (time > 0 && time < this.totalTime) {
        this.$refs.audio.currentTime = time
        this.currentTimeStr = parseDuration(this.totalTime - time);
        this.isEnded = false
      }          
    }
  },
  methods: {
    getFullPath(path) {
      const basePath = ''
      return getFullPath(path, basePath, 'audio')
    },
    // 切换播放暂停
    togglePlayer() {
      this.error = false
      this.$nextTick(() => {
        this.pauseAllPlayer();
        if (this.$refs.audio.paused) {
          if (this.times - this.currentTimes > 0) {
            if (this.isEnded) {
              this.$refs.audio.play().then(() => {
                this.currentTimes++;
                this.isEnded = false
                this.totalTime = this.$refs.audio.duration;
                this.$emit("timesAdd", this.currentTimes);
              })
            }
            this.$refs.audio.play();
          } else if (!this.isEnded) {
            this.$refs.audio.play();
          }
        } else {
          this.$refs.audio.pause();
        }
        this.paused = this.$refs.audio.paused;
      })
    },
    // 暂停所有播放器
    pauseAllPlayer() {
      let audios = document.getElementsByTagName("audio");
      let videos = document.querySelectorAll("video.custom-video");
      let newArray = Array.from(audios).concat(Array.from(videos))
      function pauseAll() {
        let self = this;
        [].forEach.call(newArray, function (i) {
          // 将audios中其他的audio全部暂停
          i !== self && i.pause();
        });
      }
      // 给play事件绑定暂停函数
      [].forEach.call(newArray, function (i) {
        i.addEventListener("play", pauseAll.bind(i));
      });
    },
    // 播放中触发
    timeupdate(e) {
      this.currentTimeStr = this.error ? '00:00' : parseDuration((e.target.duration || 0) - e.target.currentTime);
      this.$listeners.setMediaInfo && this.$listeners.setMediaInfo({
        playedTime: e.target.currentTime,
        duration: this.totalTime
      })
    },
    handleError(e) {
      console.log(e)
      this.error = true
    }
  },
};
</script>
