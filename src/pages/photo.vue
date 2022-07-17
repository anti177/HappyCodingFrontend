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
                      <el-empty v-if="processedPictureList === undefined || processedPictureList.length <= 0" description="waiting for upload">
                      </el-empty>
                      <el-carousel v-if="processedPictureList !==undefined && processedPictureList.length > 0"
                                   ref="carousel"
                                   :autoplay="false"
                                   arrow="always"
                                   trigger="click"
                                   :loop="false"
                                   indicator-position="none"
                                   @change="lisChange">
                        <el-carousel-item v-for="item in processedPictureList" :key="item.id">
                          <img v-bind:src="item.url" class="img">
                        </el-carousel-item>
                      </el-carousel>
                    </div>
                  </div>
                  <el-row style="margin-top: 3%;">
                    <el-col>
                        <el-upload ref="upload"
                                   action="#"
                                   multiple
                                   :data="uploadData"
                                   :limit=10
                                   :file-list="pictureList"
                                   list-type="picture-card"
                                   :on-preview="handlePictureCardPreview"
                                   :on-change="OnChange"
                                   :on-remove="handleRemove"
                                   :on-exceed="handleExceed"
                                   accept="image/jpeg,image/png"
                                   :auto-upload="false">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" append-to-body>
                          <img width="100%" :src="dialogImageUrl" alt="">
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

                   <div v-for="a in processedPictureList[nowId].summary" :key="a" class="text item">
                     {{a}}
                   </div>
                </el-card>
                <el-col>
                  <el-button type="primary" @click="dialogVisible2 = true" round>save</el-button>
                  <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible2"
                    width="50%" :before-close="handleClose" append-to-body>

<!--                    <div v-for="b in processedPictureList" :key="b.id" class="text item">-->
<!--                      <el-card>-->
<!--                        <img v-bind:src="b.url" class="img" @click="">-->
<!--                      </el-card>-->
<!--                    </div>-->
                    <el-checkbox-group v-model="checkList">
                      <div v-for="a in processedPictureList" :key="a.id" class="text item">
                        <el-card>
                          <el-checkbox :label="a.id + 1"></el-checkbox>
                          <img v-bind:src="a.url" class="img" @click="">
                        </el-card>
                      </div>
                    </el-checkbox-group>

                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible2 = false">quit</el-button>
                    <el-button type="primary" @click="downloadFile">sure</el-button>
                    </span>
                  </el-dialog>
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
export const downloadFile = (url) => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";  // 防止影响页面
  iframe.style.height = 0;  // 防止影响页面
  iframe.src = url;
  document.body.appendChild(iframe);  // 这一行必须，iframe挂在到dom树上才会发请求
  // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
  setTimeout(()=>{
    iframe.remove();
  }, 5 * 60 * 1000);
}
export default {
  name: 'photo.vue',
  data() {
    return {
      textarea: '',
      pic: "",
      pageTitle: 'photo',
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVisible2:false,
      nowId:0,
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      /*pictureList:['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],*/
      pictureList:[],
      fileList:[],
      checkList:[],
      processedPictureList:[
        { url:require('../../static/pic/test.png'),
          summary:['face:50%','age:20-30'],
          url2:'/static/pic/test.png',
          id:0},
        { url:require('../../static/pic/test.png'),
          summary:['face:100%','age:10-30'],
          url2:'/static/pic/test.png',
          id:1},
      ],
      imgInfoList: [], //包含图片的id,name,size的集合
      imgNameList: [], //后端返回的上传图片的name集合，传到后端
      imgSize: [], //后端返回的上传图片的imgSize集合，传到后端
      deleteImgFileList: [] //存已被删除了的图片的id
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    OnChange(file, fileList) {
      const isType = file.type === 'image/jpeg' || 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isType) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
        fileList.pop()
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
        fileList.pop()
      }
      this.pictureList.push(file)
      this.hideUpload = fileList.length >= this.limit

    },
    //删除图片时
    handleRemove(file, fileList) {
      if (file.id) {
        console.log('删除了已被上传过的图片')
        console.log(file.id)
        this.deleteImgFileList.push(file.id)
      }
      this.pictureList = fileList
      this.hideUpload = fileList.length >= this.limit
    },
    //文件超出个数限制时
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //上传图片，返回处理好的文件
    uploadData(){

    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    lisChange (index) {
      this.$refs.carousel.setActiveItem(index);
      this.nowId = index;
    },
    downloadFile(){
      const that = this;
      // const baseURL = 'file:///Users/yangyixin/PycharmProjects/front/frontend/src/pages'
      for(let i = 0; i<that.checkList.length; i++){  //循环遍历调用downloadFile方法
        // const str = that.processedPictureList[that.checkList[i]-1].url2;
        //const url = that.pictureList[that.checkList[i]-1];
        //downloadFile(url);
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
      this.dialogVisible2 = false;

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
