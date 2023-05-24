import * as THREE from 'three'
import SpriteText from '../SpriteText'

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
      value: 2.0,
      name: '第四季度'
    },
]

export default class Bar3d {
    constructor(data, type = "cylinder") {
        data = data || dataExamples

        // 创建一个组
        this.mesh = new THREE.Group()

        data.forEach((item, index) => {
            const color = new THREE.Color(Math.random() * 0xffffff)

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
            })

            if (type === 'rect') {
                const boxGeometry = new THREE.BoxGeometry(1, item.value, 1)
                const box = new THREE.Mesh(boxGeometry, material)
                box.position.set(-3 + index * 2, item.value / 2, 0)
                this.mesh.add(box)
            }
            else {
                const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, item.value)
                const cylinder = new THREE.Mesh(cylinderGeometry, material)
                cylinder.position.set(-3 + index * 2, item.value / 2, 0)
                this.mesh.add(cylinder)
            }

            // 添加字体精灵
            const textPosition = new THREE.Vector3(-3 + index * 2, item.value + 0.5, 0)
            const spriteText = new SpriteText(item.name, textPosition)
            this.mesh.add(spriteText.mesh)
        }) 
    }
}
