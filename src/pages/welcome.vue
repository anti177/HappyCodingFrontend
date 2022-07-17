<template>
<div class="building">


<!--  <div class="top">LOGO</div>-->
<!--  <div class="middle">-->

<!--    <el-row>-->
<!--      <div id="word-img">-->
<!--        <el-image :src="require('../components/pic/1.png')">-->
<!--          <div slot="error" class="image-slot">-->
<!--            <i class="el-icon-picture-outline"></i>-->
<!--          </div>-->
<!--        </el-image>-->
<!--      </div>-->
<!--    </el-row>-->
<!--    <el-row>-->
<!--      <el-col :span='24'><h3 style="font-size: 15px">Emotion recognition system with emoji replacement face function</h3></el-col>-->
<!--    </el-row>-->
<!--    <el-row :gutter="6">-->
<!--        <el-button type="primary" @click="video" round>video</el-button>-->
<!--        <el-button type="primary" @click="photo" round>photo</el-button>-->
<!--    </el-row>-->

<!--  </div>-->
<!--  <div class="bottom">Copyright © 2022 HAPPY CODING</div>-->

  <el-container>
    <el-header class="top">LOGO</el-header>
    <el-container>
      <el-container>
        <el-main class="middle">
          <el-row>
            <div id="word-img">
              <el-image :src="require('../../static/pic/1.png')">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </el-row>
          <el-row>
            <el-col :span='24'><h3 style="font-size: 15px">Emotion recognition system with emoji replacement face function</h3></el-col>
          </el-row>
          <el-row :gutter="6">
            <el-button type="primary" @click="video" round>video</el-button>
            <el-button type="primary" @click="photo" round>photo</el-button>
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
  name: 'welcome',
  data() {
    return {
      textarea: '',
      pic: "",
      pageTitle: 'welcome',
    }
  },
  methods: {
    video() {
      this.$router.push({path:'/video'})

    },
    photo() {
      this.$router.push({path:'/photo'})

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
  /*background: black url("./pic/img.png") center no-repeat local;*/
  background: #f6dfcb;
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
  background-color: #f6b99e;
  font-size: 30px;
  line-height: 70px;
}
.middle {
  position: absolute;
  top: 70px;
  bottom: 40px;
  width: 100%;
  background-color: #f6dfcb;
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
</style>
