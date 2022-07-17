import Vue from 'vue'
import Router from 'vue-router'
import welcome from "../pages/welcome";
import video from "../pages/video";
import photo from "../pages/photo";

Vue.use(Router)

export default new Router({
  routes: [ {
      path: '/',
      name: 'welcome',
      component: welcome
    },
    {
    path: '/video',
    name: 'video',
    component: video
  },
    {
    path: '/photo',
    name: 'photo',
    component: photo
  },
  ]
})
