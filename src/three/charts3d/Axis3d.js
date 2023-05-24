import * as THREE from 'three'
import SpriteText from '../SpriteText'

let dataExamples = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
]

export default class Axis3d {
    // size作为3d坐标轴的长宽高
    constructor(size = new THREE.Vector3(8, 6, 4)) {
        let data = []

        this.mesh = new THREE.Group()

        // 水平面的网格
        const gridHelper = new GridHelper(size.x, size.y)
        this.mesh.add(gridHelper)

        // 侧面的网格
        const gridVHelper = new GridHelper(size.z, size.y)
        gridVHelper.rotation.z = Math.PI / 2
        gridVHelper.position.set(-size.x / 2, size.z / 2, 0)
        this.mesh.add(gridVHelper)

        // 垂直面的网格
        const gridZhelper = new GridHelper(size.x, size.z)
        gridZhelper.rotation.x = Math.PI / 2
        gridZhelper.position.set(0, size.z / 2, -size.y / 2)
        this.mesh.add(gridZhelper)

        this.addAxixLabel()
    }

    addAxixLabel(data) {
        data = data || dataExamples

        data.forEach((item, i) => {
            const textPosition = new THREE.Vector3(i - data.length / 2 + 0.5, -0.5, 0)
            const spriteText = new SpriteText(item, textPosition, 0)

            this.mesh.add(spriteText.mesh)
        })
    }
}

class GridHelper extends THREE.LineSegments {
    constructor(sizeX = 10, sizeY = 10, color1 = 0x444444, color2 = 0xffffff) {
        color1 = new THREE.Color(color1)
        color2 = new THREE.Color(color2)

        const center = sizeY / 2
        const step = 1
        const halfSizeX = sizeX / 2
        const halfSizeY = sizeY / 2

        const vertices = []
        const colors = []
        let j = 0

        // 定义竖着的线
        for (let i = 0, k = -halfSizeX; i <= sizeX; i++, k+= step) {
            vertices.push(k, 0, -halfSizeY, k, 0, halfSizeY)

            const color = i === 0 || i === sizeX ? color2 : color1

            color.toArray(colors, j)
            j += 3
            color.toArray(colors, j)
            j += 3
        }

        // 定义横着的线
        for (let i = 0, k = -halfSizeY; i <= sizeY; i++, k += step) {
            vertices.push(-halfSizeX, 0, k, halfSizeX, 0, k)

            const color = i === 0 || i === sizeY ? color2 : color1

            color.toArray(colors, j)
            j += 3
            color.toArray(colors, j)
            j += 3
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3)
        )
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            toneMapped: false
        })

        super(geometry, material)

        this.type = 'GridHelper'
    }
}
