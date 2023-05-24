// todo 代码不完整，待以后获取到资源再修改

import * as THREE from 'three'
import SpriteText from '../SpriteText'
import gsap from 'gsap'
import { setTransitionHooks } from 'vue'

const dataExamples = [
    {
        value: 3.5,
        name: '第一季度'
    },
    {
        value: 2.7,
        name: '第二季度'
    },
    {
        value: 3.0,
        name: '第三季度'
    },
    {
        value: 2.5,
        name: '第四季度'
    },
]

export default class Pie3d {
    constructor(data, camera) {
        data = data || dataExamples

        this.mesh = new THREE.Group()
        this.num = 0

        data.forEach((item, i) => {
            this.num += item.value
        })

        let sumRotation = 0

        data.forEach((item, i) => {
            const rotation = (item.value / this.sum) * 2 * Math.PI

            const color = new THREE.Color(Math.random() * 0xffffff)

            const material = new THREE.MeshBasicMaterial({
                color,
                side: THREE.DoubleSide,
                opacity: 0.8,
                transparent: true,
            })

            const geometry = new THREE.CylinderGeometry(
              3,
              3,
              1,
              32,
              1,
              false,
              0,
              rotation
            )
    
            const cylinder = new THREE.Mesh(geometry, material)
            cylinder.rotation.y = sumRotation
            this.mesh.add(cylinder)

            sumRotation += rotation
        })

        this.addMouseMove(camera)
    }

    addMouseMove(camera) {
        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()
        const timeline = gsap.timeline()
        let currentPie = null

        window.addEventListener('mousemove', (e) => {
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1
            pointer.y = -(e.clientY / (1080 * (window.innerWidth / 1920))) * 2 + 1

            raycaster.setFromCamera(pointer, camera)

            const intersects = raycaster.intersectObjects(
              this.mesh.children,
              false
            )

             // 物体在原点
        if (
          // 检测到有物体
          intersects.length > 0
          // 当前鼠标点击的饼状是存在的
          && currentPie === null
          // 此物体没有运动
          && timeline.isActive()
      ) {
          // 鼠标放上去的物体作为移动的物体
          currentPie = intersects[0].object

          // 进行移动
          timeline.to(currentPie.position, {
              x: 1 * Math.cos(currentPie.rotation.z),
              y: 1 * Math.sin(currentPie.rotation.z),
              duration: 0.5,
          })
      }

      // 如果鼠标从当前的扇形移动到另一个扇形，那么就将之前的扇形移动回来，将当前的扇形根据当前的角度移动
      if (
          // 检测到有物体
          intersects.length > 0
          // 当前鼠标点击的饼状是存在的
          && currentPie !== null
          // 
          && currentPie !== intersects[0].object
          // 此物体没有运动
          && !timeline.isActive()
      ) {
         // 之前的物体恢复到原点
          timeline.to(currentPie.position, {
              x: 0,
              y: 0,
              duration: 0.1,
          })

          // 鼠标放上去的物体作为移动的物体
          currentPie = intersects[0].object

          // 进行移动
          timeline.to(currentPie.position, {
              x: 1 * Math.cos(currentPie.rotation.z),
              y: 1 * Math.sin(currentPie.rotation.z),
              duration: 0.5,
          })
      }

      // 当判断鼠标移出时，将currentPie置为null,恢复原点的位置
      if (
          // 没有检测到有物体
          intersects.length === 0
          // 物体存在
          && currentPie
          // 此物体没有运动
          && !timeline.isActive()
      ) {
          timeline.to(currentPie.position, {
              x: 0,
              y: 0,
              duration: 0.5,
              onComplete: () => {
                  console.log('complete')
                  currentPie = null
              }
          })
      }
        })
    }
}
