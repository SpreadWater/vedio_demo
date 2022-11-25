<template>
  <div class="box">
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-form style="width: 100%" label-width="80px">
            <el-form-item label="socketId">
              {{ $store.state.socket.mySocketId }}
              <el-button
                style="float: right"
                size="mini"
                @click="clipboardWriteText($store.state.socket.mySocketId)"
              >
                copy
              </el-button>
            </el-form-item>
            <el-form-item label="加入房间">
              <el-input v-model="roomName">
                <el-button
                  slot="suffix"
                  size="mini"
                  @click="joinRoom"
                  v-loading="loading"
                  >join</el-button
                >
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <h2>我的</h2>
          <video ref="local_video" autoplay controls></video>
        </el-col>
        <el-col :span="12" v-loading="loading">
          <h2>对方的</h2>
          <video ref="remote_video" autoplay controls></video>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      roomName: "",
    };
  },
  methods: {
    // 加入房间
    joinRoom() {
      if (!this.roomName) {
        return this.$notify({
          message: "未输入房间名",
          type: "warning",
        });
      }
      this.$socketEmit("join private room", {
        room: this.roomName,
      }).then((res) => {
        console.log(res);
        this.$notify({
          message: res.message,
          type: res.success ? "success" : "warning",
        });
        this.loading = true;
        if (res.start) {
          this.startLive();
        }
      });
    },

    // 复制sockedId
    clipboardWriteText(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.$notify({
            message: "复制成功",
            type: "success",
          });
        })
        .catch((err) => {
          this.$notify.error({
            message: res.message,
          });
        });
    },
    
    // 开始链接
    async startLive(offerSdp) {
      let stream;
      try {
        // 1.呼叫者通过 navigator.mediaDevices.getUserMedia() (en-US) 捕捉本地媒体。
        // or
        // 8.接受者做一些可能需要的步骤结束本次呼叫：捕获本地媒体，然后通过RTCPeerConnection.addTrack()添加到连接中。
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          // 如果你只有一台电脑，慎用这个选项
          // audio: true,
        });
        this.$refs.local_video.srcObject = stream;
        console.log('获取本地媒体');
      } catch {
        return this.$notify.error({
          message: "摄像头/麦克风获取失败！",
        });
      }
      // 2.呼叫者创建一个RTCPeerConnection 并调用 RTCPeerConnection.addTrack()
      stream.getTracks().forEach((track) => {
        console.log('添加track');
        this.peer.addTrack(track, stream);
      });

      if (!offerSdp) {
        // 3.呼叫者调用 RTCPeerConnection.createOffer() 来创建一个提议(offer).
        const offer = await this.peer.createOffer();
        // 4.呼叫者调用 RTCPeerConnection.setLocalDescription() (en-US) 将提议(Offer) 设置为本地描述 (即，连接的本地描述).
        await this.peer.setLocalDescription(offer);
        // 呼叫者通过信令服务器将提议(offer)传递至 本次呼叫的预期的接受者.
        this.$socketEmit("webrtc", { offer });
      } else {
        // 7.接受者收到了提议(offer) 并调用 RTCPeerConnection.setRemoteDescription() 将其记录为远程描述 (也就是连接的另一端的描述).
        await this.peer.setRemoteDescription(offerSdp);
        // 9.接受者通过 RTCPeerConnection.createAnswer() (en-US) 创建一个应答。
        const answer = await this.peer.createAnswer();
        // 11.接受者通过信令服务器将应答传递到呼叫者.
        this.$socketEmit("webrtc", { answer });
        // 10.接受者调用 RTCPeerConnection.setLocalDescription() (en-US) 将应答(answer)   设置为本地描述. 此时，接受者已经获知连接双方的配置了.
        await this.peer.setLocalDescription(answer);
      }
    },

    // 初始化RTCPeerConnection
    init() {
      this.peer = new RTCPeerConnection();
      this.$socketOn("webrtc", (res) => {
        try {
          if (res.offer) {
            this.startLive(res.offer);
          }
          if (res.answer) {
            // 12.呼叫者接受到应答.
            // 13.呼叫者调用 RTCPeerConnection.setRemoteDescription() 将应答设定为远程描述. 如此，呼叫者已经获知连接双方的配置了.
            this.peer.setRemoteDescription(res.answer);
            console.log('set remote answer-------');
          }
          if (res.candidate) {
            // 除了交换关于媒体的信息(上面提到的Offer / Answer和SDP )中，对等体必须交换关于网络连接的信息。（交换ICE候选）
            this.peer.addIceCandidate(res.candidate);
          }
        } catch (error) {
          this.$notify.error("创建链接失败");
        }
      });

      // 除了交换关于媒体的信息(上面提到的Offer / Answer和SDP )中，对等体必须交换关于网络连接的信息。（交换ICE候选）
      this.peer.onicecandidate = (e) => {
        if (e.candidate) {
          this.$socketEmit("webrtc", { candidate: e.candidate });
        }
      };

      // 每个Peer建立一个track事件的响应程序，这个事件会在远程Peer添加一个track到其stream上时被触发。
      this.peer.ontrack = (e) => {
        if (e && e.streams) {
          console.log('ontrack 触发---------');
          this.$refs.remote_video.srcObject = e.streams[0];
          this.loading = false;
        }
      };
    },
  },
  created() {
    this.init();
  },
};
</script>
<style  lang="scss" scoped>
.box {
  width: 100vw;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  .el-card {
    box-sizing: border-box;
    padding: 30px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  video {
    width: 100%;
    height: auto;
  }
}
</style>