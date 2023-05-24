import * as THREE from 'three'
import SpriteText from '../SpriteText'
import gsap from 'gsap'

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

/**
 * 实现方案就是自己画出扇形，通过积压生成扇形柱体
 */
export default class Pie3d {
    constructor(data, camera) {
        data = data || camera

        this.mesh = new THREE.Group()
        this.sum = 0

        data.forEach((item, i) => {
            this.sum += item.value
        })

        let sumRotation = 0

        data.forEach((item, i) => {
            // 百分比占360度的多少
            const rotation = (item.value / this.sum) * 2 * Math.PI

            const color = new THREE.Color(Math.random() * 0xffffff)

            const material = new THREE.MeshBasicMaterial({
                color,
                side: THREE.DoubleSide,
                opacity: 0.8,
                transparent: true,
                // depthWrite: false,
            })

            const shape = new THREE.Shape()

            // 画扇形
            shape.moveTo(0, 0)
            let rad = 0
            while(rad < rotation) {
                shape.lineTo(3 * Math.cos(rad), 3 * Math.sin(rad))
                rad += 0.05
            }
            shape.lineTo(3 * Math.cos(rotation), 3 * Math.sin(rotation))
            shape.lineTo(0, 0)

            // 设置挤出
            const extrudeSettings = {
                // 用于沿着挤出样条的深度细分的点的数量，默认值为1
                steps: 1,
                // 挤出的形状的深度，默认值为1
                depth: (item.value / this.sum) * 5,
                // 对挤出的形状应用是否斜角，默认值为true
                bevelEnabled: false,
                // 设置原始形状上斜角的厚度。默认值为0.2
                bevelThickness: 1,
                // 斜角与原始形状轮廓之间的延伸距离，默认值为bevelThickness-0.1
                bevelSize : 1,
                // Distance from the shape outline that the bevel starts. Default is 0
                bevelOffset: 0,
                // 斜角的分段层数，默认值为3
                bevelSegments: 5,
            }

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

            const cylinder = new THREE.Mesh(geometry, material)
            // 每次绘画的起始角度
            cylinder.rotation.z = sumRotation
            this.mesh.add(cylinder)

            // 添加字体精灵
            const textPosition = new THREE.Vector3(
                Math.sin(rotation) * 1.5,
                Math.cos(rotation) * 1.5,
                item.value / 2 + 0.5
            )
            const spriteText = new SpriteText(item.name, textPosition)
            cylinder.add(spriteText.mesh)

            sumRotation += rotation
        })

        this.mesh.rotation.x = -Math.PI / 2
        this.addMouseMove()
        this.camera = camera
    }

    // 鼠标放上去的移动
    addMouseMove() {
        // 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2(1, 1)
        this.timeline = gsap.timeline()
        this.currentPie = null

        window.addEventListener('mousemove', (e) => {
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
            this.pointer.y = -(e.clientY / (1080 * (window.innerWidth / 1920))) * 2 + 1
        })
    }

    update() {
        this.raycaster.setFromCamera(this.pointer, this.camera)

        // calculate objects intersecting ths picking ray
        const intersects = this.raycaster.intersectObjects(
            this.mesh.children,
            false
        )

        // 物体在原点
        if (
            // 检测到有物体
            intersects.length > 0
            // 当前鼠标点击的饼状是存在的
            && this.currentPie === null
            // 此物体没有运动
            && !this.timeline.isActive()
        ) {
            // 鼠标放上去的物体作为移动的物体
            this.currentPie = intersects[0].object

            // 进行移动
            this.timeline.to(this.currentPie.position, {
                x: 1 * Math.cos(this.currentPie.rotation.z),
                y: 1 * Math.sin(this.currentPie.rotation.z),
                duration: 0.5,
            })
        }

        // 如果鼠标从当前的扇形移动到另一个扇形，那么就将之前的扇形移动回来，将当前的扇形根据当前的角度移动
        if (
            // 检测到有物体
            intersects.length > 0
            // 当前鼠标点击的饼状是存在的
            && this.currentPie !== null
            // 
            && this.currentPie !== intersects[0].object
            // 此物体没有运动
            && !this.timeline.isActive()
        ) {
           // 之前的物体恢复到原点
           this.timeline.to(this.currentPie.position, {
                x: 0,
                y: 0,
                duration: 0.1,
            })

            // 鼠标放上去的物体作为移动的物体
            this.currentPie = intersects[0].object

            // 进行移动
            this.timeline.to(this.currentPie.position, {
                x: 1 * Math.cos(this.currentPie.rotation.z),
                y: 1 * Math.sin(this.currentPie.rotation.z),
                duration: 0.5,
            })
        }

        // 当判断鼠标移出时，将currentPie置为null,恢复原点的位置
        if (
            // 没有检测到有物体
            intersects.length === 0
            // 物体存在
            && this.currentPie
            // 此物体没有运动
            && !this.timeline.isActive()
        ) {
            this.timeline.to(this.currentPie.position, {
                x: 0,
                y: 0,
                duration: 0.5,
                onComplete: () => {
                    console.log('complete')
                    this.currentPie = null
                }
            })
        }
    }
}

