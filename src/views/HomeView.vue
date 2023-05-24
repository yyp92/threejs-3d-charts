<template>
  <div class="home" ref="screenDom">
    <div class="canvas-container"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import ThreePlus from "../three/index";
import * as THREE from "three";
import eventHub from "@/utils/eventHub";
import modifyCityMaterial from "../three/modify/modifyCityMaterial";
import gsap from "gsap";

let progress = ref(0);

let screenDom = ref(null);
const resizeFn = () => {
  // console.log(screenDom);
  let scale = window.innerWidth / 1920;
  screenDom.value.style.transform = `scale(${scale})`;
};
onMounted(() => {
  resizeFn();
  window.addEventListener("resize", resizeFn);
});

onMounted(() => {
  const container = document.querySelector(".canvas-container");

  let threePlus = new ThreePlus(".canvas-container");
  threePlus.camera.position.set(0, 5, 12);
  threePlus.camera.lookAt(0, 2, 0)
  threePlus.control.target.set(0, 2, 0)
  threePlus.setBgJpg('./assets/textures/sky02.jpg')

  // 添加坐标轴
  threePlus.addAxis3d()

  const data = [
    {
      value: 3.5,
      name: '第一季度'
    },
    {
      value: 3.0,
      name: '第二季度'
    },
    {
      value: 2.5,
      name: '第三季度'
    },
    {
      value: 2.0,
      name: '第四季度'
    },
  ]

  // 创建条形图
  // threePlus.addBar3d(data)

  // 创建饼图
  // threePlus.addPie3d(data)


  // 折线图
  threePlus.addPolyline3d();
  const dataExamples2 = [
    {
        value: 3.5,
        name: '星期一',
        type: '万台'
    },
    {
        value: 2.7,
        name: '星期二',
        type: '万台'
    },
    {
        value: 3.0,
        name: '星期三',
        type: '万台'
    },
    {
        value: 2.5,
        name: '星期四',
        type: '万台'
    },
    {
        value: 3.2,
        name: '星期五',
        type: '万台'
    },
    {
        value: 3.6,
        name: '星期六',
        type: '万台'
    },
    {
        value: 2.0,
        name: '星期日',
        type: '万台'
    },
  ]

  const pline = threePlus.addPolyline3d(dataExamples2)
  pline.mesh.position.z = -1

  // 添加光
  threePlus.setLight()

  THREE.DefaultLoadingManager.onProgress = function(item, loaded, total) {
    progress.value = new Number((loaded / total) * 100).toFixed(2)
  }
});
</script>

<style>
.home {
  width: 1920px;
  height: 1080px;
  transform-origin: 0 0;
}
.canvas-container {
  width: 100%;
  height: 100%;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  background-image: url(../assets/loading.jpg);
  background-size: cover;
  filter: blur(50px);
  z-index: 100;
}
.progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.progress > img {
  padding: 0 15px;
}

.title {
  width: 380px;
  height: 40px;
  position: fixed;
  right: 100px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  z-index: 110;
}
</style>
