<template>
  <div class="building">
    <el-container>
      <el-header class="top">LOGO</el-header>
      <el-container>
        <el-container>
          <el-main class="middle">
            <el-row gutter="6">
              <el-col :span='16'>

                <el-card class="box-card" >
                  <div slot="header" class="clearfix">
                    <div class="block">
                      <el-empty v-if="processedVideoList === undefined || processedVideoList.length <= 0" description="waiting for upload">
                      </el-empty>

                    </div>
                  </div>
                  <el-row style="margin-top: 3%;">
                    <video v-if="processedVideoList !== undefined || processedVideoList.length === 1"
                           controls="controls">
                      <source :src="processedVideoList[0].url"
                              type="video/mp4">
                      您的浏览器不支持视频播放
                    </video>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-upload ref="upload"
                                 action="#"
                                 multiple
                                 :limit=1
                                 :file-list="fileList"
                                 list-type="text"
                                 :before-upload="beforeUploadVideo"
                                 :on-preview="handleVideoCardPreview"
                                 :on-change="OnChange"
                                 :on-remove="handleRemove"
                                 :on-exceed="handleExceed"
                                 :on-progress="handleOnProgress"
                                 :on-success="handleVideoSuccess"
                                 accept=".mp4"
                                 :auto-upload="false"
                                 >
                        <i v-if="fileList === undefined || fileList.length === 0"
                           class="el-icon-plus avatar-uploader-icon"></i>
                        <el-progress v-if="videoFlag === true"
                                     type="circle"
                                     :percentage="videoUploadPercent"
                                     style="margin-top:7px;"></el-progress>
                      </el-upload>
                      <el-dialog :visible.sync="dialogVisible" append-to-body>
                        <i class="el-icon-plus"></i>
                      </el-dialog>
                    </el-col>
                  </el-row>

                </el-card>
              </el-col>
              <el-col :span='8'>
                <el-card class="box-card2" >
                  <div slot="header" class="clearfix">
                    <span style="font-size: x-large">summary</span>
                  </div>
                  <div v-for="a in processedVideoList[nowId].summary" :key="a" class="text item">
                    {{a}}
                  </div>
                </el-card>
                <el-col>
                  <el-button type="primary" @click="downloadFile" round>save</el-button>
                </el-col>

              </el-col>
            </el-row>

          </el-main>
          <el-footer class="bottom">Copyright © 2022 HAPPY CODING</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'video.vue',
  data() {
    return {
      url:"",
      videoFlag:false,
      videoUploadPercent:0,
      isShowUploadVideo:false,
      pageTitle: 'video',
      dialogVideoUrl: '',
      dialogVisible: false,
      dialogVisible2:false,
      nowId:0,
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      fileList:[],
      processedVideoList:[
        { url:'http://vjs.zencdn.net/v/oceans.mp4',
          summary:['face:50%','age:20-30'],
          url2:'/static/pic/test.png',
          id:0},
      ],
    }
  },
  methods: {
    beforeUploadVideo(file) {
      let fileSize = file.size / 1024 / 1024 < 50*10;
      if (['video/mp4'].indexOf(file.type) === -1) {
        this.$message.warning("请上传正确的视频格式");
        return false;
      }
      if (!fileSize) {
        this.$message.warning("视频大小不能超过500MB");
        return false;
      }
      this.isShowUploadVideo = false;
    },
    uploadData(){

    },
    OnChange(file, fileList) {
      const isType = file.type === 'video/mp4'|| 'video/mov'
      const isLt5M = file.size / 1024 / 1024 < 5 * 100

      if (!isType) {
        this.$message.error('上传格式必须是mp4或者mov!');
        fileList.pop()
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 500MB!');
        fileList.pop()
      }
      this.fileList.push(file)
      this.url = file.url
      this.hideUpload = fileList.length >= this.limit

    },
    handleRemove(file, fileList) {
      if (file.id) {
        console.log('删除了已被上传过的视频')
        console.log(file.id)
      }
      this.fileList = []
      this.hideUpload = fileList.length >= this.limit
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleVideoCardPreview(file) {
      this.dialogVideoUrl = file.url
      this.dialogVisible = true
    },
    handleOnProgress(event, file, fileList){
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0)*1;
    },
    //上传成功回调
    handleVideoSuccess(res, file) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      if(res.status === 200){
        this.fileList[0].id = res.data.uploadId;
        this.fileList[0].url = res.data.uploadUrl;
      }else{
        this.$message.error('视频上传失败，请重新上传！');
      }
      //前台上传地址
      //if (file.status == 'success' ) {
      //    this.videoForm.showVideoPath = file.url;
      //} else {
      //     layer.msg("上传失败，请重新上传");
      //}

      //后台上传地址
    },

    downloadFile(){
      const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';
      fetch(url).then(res => res.blob().then(blob => {
        const a = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          const filename = name || 'qrcode.jpg';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        }));
    }

  }
}
</script>

<style scoped>
.building{
  width:100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
  /*background: black url("../components/pic/img.png") center no-repeat local;*/
  background: navajowhite;
  top:0px;
}
#word-img {
}

* {
  margin: 0;
  padding: 0;
}
html, body {
  width: 100%;
  height: 100%;
}
.top {
  width: 100%;
  height: 70px;
  background-color: #f6dfcb;
  font-size: 30px;
  line-height: 70px;
}
.middle {
  position: absolute;
  top: 70px;
  bottom: 40px;
  width: 100%;
  background-color: #efefd6;
  font-size: 70px;
  text-align: center;
}
.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px; /*行高与高度相等，内容垂直居中*/
  background-color: #f6b99e;
  text-align: center;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  margin-left: 5%;
  position: center;
  offset: center;
  background-color: transparent;
  overflow-y:auto

}
.box-card2 {
  margin-right: 5%;

  position: center;
  offset: center;
  background-color: transparent;
  overflow-y:auto

}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
img {
  max-width: 100%;
  max-height: 100%;
}
</style>
