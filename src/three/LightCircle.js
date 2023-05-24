import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

export default class LightCircle {
  constructor(
    scene,

    position = new THREE.Vector3(0, 0, 0),
    scale = 1
  ) {
    
    this.gltfLoader("./model/lightCircle.glb").then((gltf) => {
      // 创建一个平面
      this.mesh = gltf.scene.children[0];
      const planeGeometry = gltf.scene.children[0].geometry;
      this.mesh.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: texture,
        alphaMap: texture,
      });

      this.mesh.position.copy(position);
      this.mesh.scale.set(scale, scale * 1.5, scale);
      scene.add(this.mesh);
    });
  }
  gltfLoader(url) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/gltf/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    return new Promise((resolve, reject) => {
      gltfLoader.load(url, (gltf) => {
        resolve(gltf);
      });
    });
  }
}
