A-frame Avatar

An avatar for the web metaverse.

# Feature
* editors with sliders of every bone
* textures
* bvh
* using a complex avatar mesh like https://github.com/RuthAndRoth/Ruth2

```
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
