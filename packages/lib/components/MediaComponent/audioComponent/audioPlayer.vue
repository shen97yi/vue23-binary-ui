<template>
  <div class="audioplayer stop-swiping">
    <div class="player-content" v-if="mode === 'bar'">
      <div
        class="icon-player"
        @click="togglePlayer"
      >
        <img :src="paused ? require('@/assets/play.svg') : require('@/assets/pause.svg')" class="iconfont" alt="" />
      </div>
      <div class="current-time">{{ currentTimeStr }}</div>
      <div
        class="status-bar"
        @click="changePregress"
      >
        <div
          class="btm-status"
          ref="totalProgress"
        ></div>
        <div
          class="current-status"
          :style="{ width: statusBarWidth }"
        ></div>
      </div>
      <div class="total-time">{{ totalTimeStr }}</div>
    </div>
    <div class="player-content-circle" v-if="mode === 'circle'">
      <div class="icon-player" @click="togglePlayer">
        <img
          :src="paused ? require('@/assets/play.svg') : require('@/assets/pause.svg')"
        ></img>
        <div class="txt">
          {{ paused ? t("play") : t("pause") }}
        </div>
      </div>
    </div>
    <div class="mobile-player-content player-content" v-if="mode === 'mobile-bar'">
      <div
        class="icon-player"
        @click="togglePlayer"
      >
        <img :src="paused ? require('@/assets/play.svg') : require('@/assets/pause.svg')" class="iconfont" alt="" />
      </div>
      <div
        class="status-bar"
        @click="changePregress"
      >
        <div
          class="btm-status"
          ref="totalProgress"
        ></div>
        <div
          class="current-status"
          :style="{ width: statusBarWidth }"
        ></div>
        <div 
          class="ball-status"         
          :style="{ left: statusBarWidth }">
        </div>
      </div>
      <div class="total-time">{{ totalTimeStr }}</div>
    </div>
    <div class="error-tip" v-if="error">{{t('transcodeTip1')}}</div>
    <!-- <div
      class="player-tip"
      v-if="times && !isQuestionBank"
    >*{{t('numberOfPlaysAllowed')}}：{{ times === -1 ? t('notLimit1') : times}}</div> -->
    <audio
      class="audioTag"
      ref="audio"
      preload="none"
      :src="getFullPath(src)"
      :currentTime="currentTime"
      @timeupdate="timeupdate"
      @canplaythrough="loadAudio"
      @pause="paused = true"
      @play="paused = false"
      @error="handleError"
      v-if="!error"
    ></audio>
  </div>
</template>

<script>
import "@/components/MediaComponent/style/audioPlayer.scss";
import { parseDuration } from "@/utils";
import { getFullPath } from '@/utils/file.js';
import { useT } from "@/locale/index.js"
export default {
  data() {
    return {
      currentTimeStr: "00:00",
      totalTime: 0,
      statusBarWidth: 0,
      paused: true,
      currentTime: 0,
      error: false,
      loading: false,
      t: useT()
    };
  },
  props: {
    // 音频的src
    src: {
      type: String,
      default: "",
    },
    times: {
      type: Number,
      default: 0,
    },
    isQuestionBank: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'bar'
    }
  },
  mounted() {
  },
  computed: {
    iconStatus() {
      var icon = ''
      if (this.paused) {
        icon = 'icon-yinpin_zanting-01'
      } else if (this.loading) {
        icon = 'icon-yinpin_zhongbo-01'
      } else if (this.error) {
        icon = 'icon-yinpin_guanbi-01'
      } else {
        icon = 'icon-yinpin_bofang-01'
      }
      return icon
    },
    totalTimeStr() {
      return this.totalTime > 0 ? parseDuration(this.totalTime) : "00:00";
    }
  },
  methods: {
    getFullPath(path) {
      const basePath = ''
      return getFullPath(path, basePath, 'audio')
    },
    togglePlayer() {
      this.error = false
      this.$nextTick(() => {
        this.pauseAllPlayer();
        this.$refs.audio.paused
          ? this.$refs.audio.play()
          : this.$refs.audio.pause();
        this.paused = this.$refs.audio.paused;
      })
    },
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
      this.paused = true;
    },
    timeupdate(e) {
      this.totalTime = e.target.duration;
      this.statusBarWidth =
        ((e.target.currentTime * 1000) / (this.totalTime * 1000)) * 100 + "%";
      this.currentTime = e.target.currentTime;
    },
    loadAudio(e) {
      this.loading = true
      this.totalTime = e.target.duration;
      this.$nextTick(() => {
        this.loading = false
      })
    },
    changePregress(e) {
      let event = e;
      this.$refs.audio.pause();
      let leftVal = event.offsetX - this.$refs.totalProgress.offsetLeft;
      this.statusBarWidth =
        (leftVal / this.$refs.totalProgress.offsetWidth) * 100 + "%";
      this.currentTime =
        (leftVal / this.$refs.totalProgress.offsetWidth) * this.totalTime;
      this.$refs.audio.currentTime = this.currentTime;
      this.$refs.audio.play();
    },
    handleError(e) {
      this.error = true
    }
  },
  watch: {
    currentTime(newVal) {
      this.currentTimeStr = newVal > 0 ? parseDuration(newVal) : '00:00';
    },
  },
};
</script>
<style lang="scss" scoped>
.player-content-circle {
  position: relative;
  height: 120px;
  .icon-player {
    position: absolute;
    width: 72px;
    height: 72px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.08);
    border-radius: 50%;
    .iconfont {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 22px;
      color: #EA5947;
    }
    .txt {
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translate(-50%);
      font-size: 12px;
      color: #969696;
      white-space: nowrap;
    }
  }
}
.player-content {
  .icon-player {
    .iconfont {
      width: 24px;
      margin-bottom: 6px;
      cursor: pointer;
    }
  }
}
.mobile-player-content {
  width: 340px;
  height: 46px;
  border: 1px solid #F1F3F7;
  box-shadow: 0 2px 4px 0 rgba(216,216,216,0.25);
  border-radius: 24px;
  .icon-player {
    margin-right: 6px;
    width: 43px;
    border-right: 1px solid #E3E3E9;
    border-radius: 0;
    .iconfont {
      font-size: 16px;
      color: #EA5947;
    }
  }
  .status-bar {
    .btm-status {
      background-color: #e3e3e9;
    }
    .current-status {
      background: #EA5947;
    }
    .ball-status {
      position: absolute;
      top: 50%;
      z-index: 1;
      transform: translate(-50%, -50%);
      width: 15px;
      height: 15px;
      background: #FFFFFF;
      border-radius: 50%;
      border: 1px solid #e3e3e9;
      box-shadow: 0 2px 4px 0 rgba(216,216,216,0.25);
    }
  }
  .total-time {
    font-size: 12px;
    color: #969696;
    line-height: 44px;
  }
}

</style>

