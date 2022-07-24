<template>
  <div class="building">
    <el-container>
      <el-header class="top">
        <el-row>
          <el-col :span="1" >
            <el-button @click="goBack"  type="text">back</el-button>
          </el-col>
          <el-col :span="23">
            <p>EMOJI-CAM</p>
          </el-col>
        </el-row>

      </el-header>
      <el-container>
        <el-container>
          <el-main class="middle" v-loading="loading">
            <el-row >
              <el-col :span='16'>

                <el-card class="box-card" >

                    <div class="block">
                      <el-empty v-if="processedVideoList === undefined || processedVideoList.length !== 1" description="waiting for upload">
                      </el-empty>
                    </div>
                  <el-row >
                    <video v-if="processedVideoList !== undefined && processedVideoList.length === 1"
                           controls="controls" >
                      <source :src="processedVideoList[0].url"
                              type="video/mp4">
                      Your browser does not support video playback
                    </video>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-upload ref="upload"
                                 action="http://localhost:8080/api/video"
                                 :limit=1
                                 :file-list="fileList"
                                 list-type="text"
                                 :before-upload="beforeUploadVideo"
                                 :on-remove="handleRemove"
                                 :on-exceed="handleExceed"
                                 :on-progress="handleOnProgress"
                                 :on-success="handleVideoSuccess"
                                 :on-error="handleOnError"
                                 accept=".mp4"
                                 >
                        <el-button type="primary" icon="el-icon-plus" circle></el-button>
                        <el-progress v-if="videoFlag === true"
                                     type="circle"
                                     :percentage="videoUploadPercent"
                                     style="margin-top:7px;"></el-progress>
<!--                        <el-button slot="trigger"  type="primary">选取文件</el-button>-->
<!--                        <el-button style="margin-left: 10px;"  type="success" @click="uploadData">上传到服务器</el-button>-->

                      </el-upload>

                    </el-col>
                  </el-row>

                </el-card>
              </el-col>
              <el-col :span='8'>
                <el-card class="box-card2"
                         v-if="!(processedVideoList !== undefined && processedVideoList.length !== 0)">
                  <div slot="header" class="clearfix">
                    <p style="font-size: small">Waiting for Analysis</p>

                  </div>
                </el-card>
                <el-card class="box-card2" v-else>

                  <div v-for="(a,index) in processedVideoList[0].summary" :key="a">

                    <el-row>
                      <el-card class="box-card">
                        <div class="golf">
                          <el-row>
                            <div class="photo">
                              <el-image
                                :src="a.img"
                                :fit="cover"></el-image>
                            </div>
                            <div class="intro">
                              <el-card style="text-align: left" class="el-card3">
                                <p>age: about {{ a.age }}</p>
                                <p>happy: {{ a.happy }}%</p>
                                <p>fear: {{ a.fear }}%</p>
                                <p>sad: {{ a.sad }}%</p>
                                <p>calm: {{ a.calm }}%</p>
                                <p>surprised: {{ a.surprised}}%</p>
                                <p>disgusted: {{ a.disgusted }}%</p>
                                <p>confused: {{ a.confused }}%</p>
                                <p>angry: {{ a.angry }}%</p>


                                <el-tag v-if=a.male size="medium">male</el-tag>
                                <el-tag v-if=!a.male size="medium">female</el-tag>
                                <el-tag v-if=a.bearded size="medium">bearded</el-tag>
                                <el-tag v-if=!a.bearded size="medium">non-bearded</el-tag>
                              </el-card>
                            </div>
                          </el-row>
                        </div>

                      </el-card>
                    </el-row>
                  </div>

                </el-card>
                <el-col>
                  <el-button type="primary" @click="downloadFile" round>save</el-button>
                </el-col>

              </el-col>
            </el-row>

          </el-main>
        </el-container>
        <el-footer class="bottom">Copyright © 2022 HAPPY CODING</el-footer>
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
      dialogVisible: true,
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
      loading: false
    }
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    beforeUploadVideo(file) {
      let fileSize = file.size / 1024 / 1024 < 50*10;
      if (['video/mp4'].indexOf(file.type) === -1) {
        this.$message.warning("Please upload the correct video format (mp4 only)");
        return false;
      }
      if (!fileSize) {
        this.$message.warning("Video size cannot exceed 500MB");
        return false;
      }
      this.isShowUploadVideo = false;
    },
    OnChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift();
      }
      const isType = file.type === 'video/mp4'
      const isLt5M = file.size / 1024 / 1024 < 5 * 100

      if (!isType) {
        this.$message.error('上传格式必须是mp4或者mov!');
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 500MB!');
        return false
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
      this.dialogVisible = true
    },
    handleExceed(files, fileList) {
      this.$message.warning(`Currently limited to 1 file, this time chose ${files.length} ，totally chose ${files.length + fileList.length} `);
    },
    handleOnError(err, file, fileList) {
      this.loading = false;
      this.$message.error('sorry something wrong please try again！');
    },
    handleOnProgress(event, file, fileList){
      this.videoFlag = true;
      this.dialogVisible = false;
      this.loading = true;
      this.videoUploadPercent = file.percentage.toFixed(0)*1;
    },
    //上传成功回调
    handleVideoSuccess(res, file) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.loading = false;
      if(res.code === 200){
        //TODO: 得到返回的文件，展示到前端视频页面 + summary页面+更新下载链接
        // this.fileList[0].id = res.data.uploadId;
        // this.fileList[0].url = res.data.uploadUrl;
        this.$message({
          message: 'upload success',
          type: 'success'
        });
        this.url = res.url;
      }else{
        this.$message.error('sorry something wrong please try again！');
      }
      //前台上传地址
      //if (file.status == 'success' ) {
      //    this.videoForm.showVideoPath = file.url;
      //} else {
      //     layer.msg("上传失败，请重新上传");
      //}

    },

    downloadFile(){
      //const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';
      const url = this.url;
    //   fetch(url,{
    //     mode: 'no-cors'}).then(res => res.blob().then(blob => {
    //     const a = document.createElement('a');
    //       const url = window.URL.createObjectURL(blob);
    //       const filename = name || 'm1.mp4';
    //       a.href = url;
    //       a.download = filename;
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //     }));
    //   let blob=new Blob([data.Body], {type: data.ContentType});
    //   let link=document.createElement('a');
    //   link.href=window.URL.createObjectURL(blob);
    //   link.download=url;
    //   link.click();
      window.location.href = url
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
.intro {
  float: right;
  font-size: large;
}
.photo {
  float: left;
}
.el-card3 {
  background-color: #f6dfcb;
}

</style>
