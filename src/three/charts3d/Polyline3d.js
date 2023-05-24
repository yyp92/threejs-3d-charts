import * as THREE from 'three'
import SpriteText from '../SpriteText'
import gsap from 'gsap'

const dataExamples = [
    {
        value: 2.5,
        name: '星期一',
        type: '万台'
    },
    {
        value: 1.7,
        name: '星期二',
        type: '万台'
    },
    {
        value: 2.0,
        name: '星期三',
        type: '万台'
    },
    {
        value: 1.5,
        name: '星期四',
        type: '万台'
    },
    {
        value: 2.2,
        name: '星期五',
        type: '万台'
    },
    {
        value: 2.6,
        name: '星期六',
        type: '万台'
    },
    {
        value: 1.0,
        name: '星期日',
        type: '万台'
    },
]

export default class Polyline3d {
    constructor(data) {
        data = data || dataExamples
        this.mesh = new THREE.Group()

        const color = new THREE.Color(Math.random() * 0xffffff)

        const material = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide,
            opacity: 0.8,
            transparent: true,
        })

         // 设置挤出
         const extrudeSettings = {
            // 用于沿着挤出样条的深度细分的点的数量，默认值为1
            steps: 1,
            // 挤出的形状的深度，默认值为1
            depth: 0.5,
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

        const shape = new THREE.Shape()
        // 画扇形
        shape.moveTo(0, 0)

        data.forEach((item, i) => {
            shape.lineTo(i, item.value)

            // 添加字体精灵
            const textPosition = new THREE.Vector3(
                i,
                item.value + 0.5,
                0
            )
            const spriteText = new SpriteText(
                '' + item.value + item.type,
                textPosition
            )
            this.mesh.add(spriteText.mesh)
        })

        shape.lineTo(data.length - 1, 0)
        shape.lineTo(0, 0)

        const geomotry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

        const mesh = new THREE.Mesh(geomotry, material)
        this.mesh.position.set(-3, 0, 0)
        this.mesh.add(mesh)
    }
}
