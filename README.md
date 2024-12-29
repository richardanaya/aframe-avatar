# A-frame Avatar

An avatar for the web metaverse. 100+ bones to build characters with!

This is extremely alpha. MIT licensed.

[demo](https://richardanaya.github.io/aframe-avatar/)

<img width="1011" alt="Screenshot 2024-12-29 at 8 39 55 AM" src="https://github.com/user-attachments/assets/fdea057d-fb8d-4d2e-b730-466cee54b274" />


## Features
* editors with sliders of every bone
* textures
* bvh
* using a complex avatar mesh like https://github.com/RuthAndRoth/Ruth2

```
<script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/"
        }
      }
</script>
<script src="https://richardanaya.github.io/aframe-avatar/aframe-avatar.js"></script>
...
 <a-entity
    position="0 0 0"
    avatar-model="
      model: ruth.glb;
      editor: true;
      headTexture: textures/Ruth2v4UV_Head.png;
      upperTexture: textures/Ruth2v4UV_Upper.png;
      lowerTexture: textures/Ruth2v4UV_Lower.png;
      bvhUrl: pirouette.bvh
      "
  >
  </a-entity>
```

# Bugs
* BVH with legs can be janky
* intiial values of sliders
* sliders feel weird (can't actually slide)

# Things i'd like to do
* Pose as JSON
* PBR textures
* Animation builder
* eye textures
* make distributing this thing better
* ability to tell avatar to walk to a location with a walking animation controller
