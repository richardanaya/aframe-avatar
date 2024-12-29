import { Object3D } from "three";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { BVHLoader } from "three/addons/loaders/BVHLoader.js";

export const boneCategories = {
  face: {
    name: "Face",
    bones: [
      "mHead",
      "mSkull",
      "mEyeRight",
      "mEyeLeft",
      "mFaceRoot",
      "mFaceEyeAltRight",
      "mFaceEyeAltLeft",
      "mFaceForeheadLeft",
      "mFaceForeheadRight",
      "mFaceEyebrowOuterLeft",
      "mFaceEyebrowCenterLeft",
      "mFaceEyebrowInnerLeft",
      "mFaceEyebrowOuterRight",
      "mFaceEyebrowCenterRight",
      "mFaceEyebrowInnerRight",
      "mFaceEyeLidUpperLeft",
      "mFaceEyeLidLowerLeft",
      "mFaceEyeLidUpperRight",
      "mFaceEyeLidLowerRight",
      "mFaceNoseLeft",
      "mFaceNoseCenter",
      "mFaceNoseRight",
      "mFaceCheekLowerLeft",
      "mFaceCheekUpperLeft",
      "mFaceCheekLowerRight",
      "mFaceCheekUpperRight",
      "mFaceJaw",
      "mFaceChin",
      "mFaceTeethLower",
      "mFaceLipLowerLeft",
      "mFaceLipLowerRight",
      "mFaceLipLowerCenter",
      "mFaceTongueBase",
      "mFaceTongueTip",
    ],
  },
  torso: {
    name: "Torso",
    bones: [
      "mPelvis",
      "mTorso",
      "mChest",
      "mNeck",
      "CHEST",
      "BELLY",
      "LOWER_BACK",
      "UPPER_BACK",
      "LEFT_PEC",
      "RIGHT_PEC",
      "LEFT_HANDLE",
      "RIGHT_HANDLE",
      "PELVIS",
      "BUTT",
    ],
  },
  arms: {
    name: "Arms",
    bones: [
      "mCollarLeft",
      "mShoulderLeft",
      "mElbowLeft",
      "mWristLeft",
      "L_HAND",
      "L_LOWER_ARM",
      "L_UPPER_ARM",
      "L_CLAVICLE",
      "mCollarRight",
      "mShoulderRight",
      "mElbowRight",
      "mWristRight",
      "R_HAND",
      "R_LOWER_ARM",
      "R_UPPER_ARM",
      "R_CLAVICLE",
    ],
  },
  hands: {
    name: "Hands",
    bones: [
      "mHandMiddle1Left",
      "mHandMiddle2Left",
      "mHandMiddle3Left",
      "mHandIndex1Left",
      "mHandIndex2Left",
      "mHandIndex3Left",
      "mHandRing1Left",
      "mHandRing2Left",
      "mHandRing3Left",
      "mHandPinky1Left",
      "mHandPinky2Left",
      "mHandPinky3Left",
      "mHandThumb1Left",
      "mHandThumb2Left",
      "mHandThumb3Left",
      "mHandMiddle1Right",
      "mHandMiddle2Right",
      "mHandMiddle3Right",
      "mHandIndex1Right",
      "mHandIndex2Right",
      "mHandIndex3Right",
      "mHandRing1Right",
      "mHandRing2Right",
      "mHandRing3Right",
      "mHandPinky1Right",
      "mHandPinky2Right",
      "mHandPinky3Right",
      "mHandThumb1Right",
      "mHandThumb2Right",
      "mHandThumb3Right",
    ],
  },
  legs: {
    name: "Legs",
    bones: [
      "mHipRight",
      "mKneeRight",
      "mAnkleRight",
      "mFootRight",
      "mToeRight",
      "R_FOOT",
      "R_LOWER_LEG",
      "R_UPPER_LEG",
      "mHipLeft",
      "mKneeLeft",
      "mAnkleLeft",
      "mFootLeft",
      "mToeLeft",
      "L_FOOT",
      "L_LOWER_LEG",
      "L_UPPER_LEG",
    ],
  },
};

export class Avatar {
  constructor(modelUrl) {
    this.modelUrl = modelUrl;
    this.gltf = null;
    this.bones = [];
  }

  async load(scene) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        this.modelUrl,
        (gltfResult) => {
          this.gltf = gltfResult;
          scene.add(this.gltf.scene);
          this.setupBones();
          resolve(this);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        reject
      );
    });
  }

  setupBones() {
    this.bones = [];
    this.gltf.scene.traverse((object) => {
      if (object.isBone) {
        this.bones.push(object);
      }
    });
  }

  rotateBone(bone, axis, angleRadians) {
    const q = new THREE.Quaternion();
    const vec = new THREE.Vector3();

    if (axis === "x") vec.set(1, 0, 0);
    else if (axis === "y") vec.set(0, 1, 0);
    else if (axis === "z") vec.set(0, 0, 1);

    q.setFromAxisAngle(vec, angleRadians);
    bone.quaternion.premultiply(q);
    bone.updateMatrixWorld(true);
  }

  scaleBone(bone, scale) {
    bone.scale.set(scale, scale, scale);
    bone.updateMatrixWorld(true);
  }

  positionBone(bone, axis, value) {
    const clampedValue = Math.max(-0.25, Math.min(0.25, value));

    if (axis === "x") bone.position.x = clampedValue;
    else if (axis === "y") bone.position.y = clampedValue;
    else if (axis === "z") bone.position.z = clampedValue;

    bone.updateMatrixWorld(true);
  }

  updateTexture(type, textureUrl) {
    const texture = new THREE.TextureLoader().load(textureUrl);
    texture.flipY = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    this.gltf.scene.traverse((object) => {
      if (object.material) {
        if (type === "head" && object.material.name === "mat_head") {
          object.material.map = texture;
          object.material.needsUpdate = true;
        } else if (
          type === "upper" &&
          (object.material.name === "mat_neck" ||
            object.material.name === "mat_tank" ||
            object.material.name === "mat_sleeves" ||
            object.material.name === "mat_hands")
        ) {
          object.material.map = texture;
          object.material.needsUpdate = true;
        } else if (
          type === "lower" &&
          (object.material.name === "mat_shorts" ||
            object.material.name === "mat_stockings" ||
            object.material.name === "mat_feet")
        ) {
          object.material.map = texture;
          object.material.needsUpdate = true;
        }
      }
    });
  }

  update() {
    if (this.gltf && this.gltf.animations && this.gltf.animations.length) {
      this.gltf.scene.traverse((object) => {
        if (object.isSkinnedMesh) {
          object.skeleton.update();
        }
      });
    }
  }

  getBones() {
    return this.bones;
  }
}

const bones = [
  "mPelvis",
  "mTorso",
  "mChest",
  "mNeck",
  "mHead",
  "mSkull",
  "mEyeRight",
  "mEyeLeft",
  "mFaceRoot",
  "mFaceEyeAltRight",
  "mFaceEyeAltLeft",
  "mFaceForeheadLeft",
  "mFaceForeheadRight",
  "mFaceEyebrowOuterLeft",
  "mFaceEyebrowCenterLeft",
  "mFaceEyebrowInnerLeft",
  "mFaceEyebrowOuterRight",
  "mFaceEyebrowCenterRight",
  "mFaceEyebrowInnerRight",
  "mFaceEyeLidUpperLeft",
  "mFaceEyeLidLowerLeft",
  "mFaceEyeLidUpperRight",
  "mFaceEyeLidLowerRight",
  "mFaceEar1Left",
  "mFaceEar2Left",
  "mFaceEar1Right",
  "mFaceEar2Right",
  "mFaceNoseLeft",
  "mFaceNoseCenter",
  "mFaceNoseRight",
  "mFaceCheekLowerLeft",
  "mFaceCheekUpperLeft",
  "mFaceCheekLowerRight",
  "mFaceCheekUpperRight",
  "mFaceJaw",
  "mFaceChin",
  "mFaceTeethLower",
  "mFaceLipLowerLeft",
  "mFaceLipLowerRight",
  "mFaceLipLowerCenter",
  "mFaceTongueBase",
  "mFaceTongueTip",
  "mFaceJawShaper",
  "mFaceForeheadCenter",
  "mFaceNoseBase",
  "mFaceTeethUpper",
  "mFaceLipUpperLeft",
  "mFaceLipUpperRight",
  "mFaceLipCornerLeft",
  "mFaceLipCornerRight",
  "mFaceLipUpperCenter",
  "mFaceEyecornerInnerLeft",
  "mFaceEyecornerInnerRight",
  "mFaceNoseBridge",
  "HEAD",
  "NECK",
  "mCollarLeft",
  "mShoulderLeft",
  "mElbowLeft",
  "mWristLeft",
  "mHandMiddle1Left",
  "mHandMiddle2Left",
  "mHandMiddle3Left",
  "mHandIndex1Left",
  "mHandIndex2Left",
  "mHandIndex3Left",
  "mHandRing1Left",
  "mHandRing2Left",
  "mHandRing3Left",
  "mHandPinky1Left",
  "mHandPinky2Left",
  "mHandPinky3Left",
  "mHandThumb1Left",
  "mHandThumb2Left",
  "mHandThumb3Left",
  "L_HAND",
  "L_LOWER_ARM",
  "L_UPPER_ARM",
  "L_CLAVICLE",
  "mCollarRight",
  "mShoulderRight",
  "mElbowRight",
  "mWristRight",
  "mHandMiddle1Right",
  "mHandMiddle2Right",
  "mHandMiddle3Right",
  "mHandIndex1Right",
  "mHandIndex2Right",
  "mHandIndex3Right",
  "mHandRing1Right",
  "mHandRing2Right",
  "mHandRing3Right",
  "mHandPinky1Right",
  "mHandPinky2Right",
  "mHandPinky3Right",
  "mHandThumb1Right",
  "mHandThumb2Right",
  "mHandThumb3Right",
  "R_HAND",
  "R_LOWER_ARM",
  "R_UPPER_ARM",
  "R_CLAVICLE",
  "CHEST",
  "LEFT_PEC",
  "RIGHT_PEC",
  "UPPER_BACK",
  "BELLY",
  "LEFT_HANDLE",
  "RIGHT_HANDLE",
  "LOWER_BACK",
  "mHipRight",
  "mKneeRight",
  "mAnkleRight",
  "mFootRight",
  "mToeRight",
  "R_FOOT",
  "R_LOWER_LEG",
  "R_UPPER_LEG",
  "mHipLeft",
  "mKneeLeft",
  "mAnkleLeft",
  "mFootLeft",
  "mToeLeft",
  "L_FOOT",
  "L_LOWER_LEG",
  "L_UPPER_LEG",
  "PELVIS",
  "BUTT",
];

const sliders = [
  ...bones
    .filter((bone) => bone.startsWith("m"))
    .map((bone) => ({
      name: bone,
      rot_x: { min: -Math.PI, max: Math.PI },
      rot_y: { min: -Math.PI, max: Math.PI },
      rot_z: { min: -Math.PI, max: Math.PI },
    })),
  ...bones
    .filter((bone) => !bone.startsWith("m"))
    .map((bone) => ({
      name: bone,
      scale: { min: 0, max: 400 },
      pos_x: { min: -0.25, max: 0.25 },
      pos_y: { min: -0.25, max: 0.25 },
      pos_z: { min: -0.25, max: 0.25 },
    })),
];

AFRAME.registerComponent("avatar-model", {
  schema: {
    model: { type: "string", default: "ruth.glb" },
    headTexture: { type: "string", default: "" },
    upperTexture: { type: "string", default: "" },
    lowerTexture: { type: "string", default: "" },
    bvhUrl: { type: "string", default: "" },
    editor: { type: "boolean", default: false },
  },

  filterBonesByCategory: function (category) {
    // Hide all bone containers first
    const allBoneContainers = this.sliderEntity.querySelectorAll("[bone-name]");
    allBoneContainers.forEach((container) => {
      container.object3D.visible = false;
    });

    // Show only the bones in the selected category
    const categoryBones = boneCategories[category].bones;
    categoryBones.forEach((boneName) => {
      const boneContainer = this.sliderEntity.querySelector(
        `[bone-name="${boneName}"]`
      );
      if (boneContainer) {
        boneContainer.object3D.visible = true;
      }
    });
  },

  init: function () {
    this.avatar = new Avatar(this.data.model);
    this.setupAvatar();
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.sliderEntity = null;
    this.onSliderChange = this.onSliderChange.bind(this);
    this.updateEditor();
  },

  onSliderChange: function (evt) {
    const value = evt.detail.value;
    const boneName = evt.target.getAttribute("bone-name");
    const boneTarget = evt.target.getAttribute("bone-target");
    const bone = this.avatar.getBones().find((b) => b.name === boneName);
    if (boneTarget === "scale") {
      this.scaleBone(bone, value / 100);
    } else if (boneTarget.startsWith("pos")) {
      const axis = boneTarget.split("_")[1];
      this.positionBone(bone, axis, value);
    } else if (boneTarget.startsWith("rot")) {
      const axis = boneTarget.split("_")[1];
      this.rotateBone(bone, axis, value);
    }
  },

  createSlidersForBone: function (bone, parentContainer) {
    const sliderDetails = sliders.find((slider) => slider.name === bone);
    if (!sliderDetails) return;

    const details = { ...sliderDetails }; // Clone to avoid modifying original
    delete details.name;
    const keys = Object.keys(details);

    // Create sliders stacked vertically
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const range = details[key];

      // Create slider entity
      const sliderEntity = document.createElement("a-entity");
      sliderEntity.setAttribute("position", `0 ${-i * 0.05} 0`); // Stack vertically
      sliderEntity.setAttribute("bone-name", bone);
      sliderEntity.setAttribute("bone-target", key);

      // Create label
      const label = document.createElement("a-text");
      label.setAttribute("value", key);
      label.setAttribute("position", "-0.5 0 0");
      label.setAttribute("scale", "0.2 0.2 0.2");
      label.setAttribute("color", "#ff0000");
      label.setAttribute("align", "right");
      sliderEntity.appendChild(label);

      // Setup slider with proper range
      sliderEntity.setAttribute("slider", {
        min: range.min,
        max: range.max,
        value: key === "scale" ? 100 : 0,
        axis: "x",
        sliderWidth: 1,
        sliderHeight: 0.02,
      });

      parentContainer.appendChild(sliderEntity);
    }

    // create a title at the top of the bone
    const title = document.createElement("a-text");
    title.setAttribute("value", bone);
    title.setAttribute("position", `0 ${keys.length * -0.05} 0`);
    title.setAttribute("scale", "0.25 0.25 0.25");
    title.setAttribute("color", "#ff0000");
    // center
    title.setAttribute("align", "center");
    parentContainer.appendChild(title);
  },

  updateEditor: function () {
    if (this.data.editor && !this.sliderEntity) {
      // Create a container for category buttons
      const buttonContainer = document.createElement("a-entity");
      buttonContainer.setAttribute("position", "0 1.65 1");
      buttonContainer.setAttribute("scale", "0.1 0.1 0.1");
      this.el.appendChild(buttonContainer);

      // Create buttons for each category
      const categories = ["torso", "arms", "legs", "face", "hands"];
      this.categoryButtons = {};

      categories.forEach((category, index) => {
        const button = document.createElement("a-entity");
        button.setAttribute("geometry", {
          primitive: "plane",
          width: 0.8,
          height: 0.3,
        });
        button.setAttribute("material", {
          color: "#444444",
          opacity: 0.8,
        });
        button.setAttribute("position", `${(index - 2) * 1} 0 0`);

        // Add text label
        const text = document.createElement("a-text");
        text.setAttribute("value", boneCategories[category].name);
        text.setAttribute("align", "center");
        text.setAttribute("color", "#ffffff");
        text.setAttribute("scale", "0.3 0.3 0.3");
        text.setAttribute("position", "0 0 0.01");
        button.appendChild(text);

        // Store reference to button
        this.categoryButtons[category] = button;

        // Add click handler
        button.addEventListener("click", () => {
          // Reset all buttons to default color
          Object.values(this.categoryButtons).forEach((btn) => {
            btn.setAttribute("material", {
              color: "#444444",
              opacity: 0.8,
            });
          });

          // Highlight selected button
          button.setAttribute("material", {
            color: "#ff4444",
            opacity: 0.8,
          });

          // Update current category and refresh sliders
          this.currentCategory = category;
          createSlidersForCategory(category);
        });

        buttonContainer.appendChild(button);
      });

      // Create a container for all bone sliders
      const mainContainer = document.createElement("a-entity");
      mainContainer.setAttribute("position", "0 1.6 1");
      mainContainer.setAttribute("scale", "0.1 0.1 0.1");
      this.el.appendChild(mainContainer);

      // Store references to containers
      this.sliderEntity = mainContainer;

      // Set initial category
      this.currentCategory = "torso";
      this.categoryButtons["torso"].setAttribute("material", {
        color: "#ff4444",
        opacity: 0.8,
      });

      // Filter and create sliders for bones in current category
      const createSlidersForCategory = (category) => {
        // Clear existing sliders
        while (mainContainer.firstChild) {
          mainContainer.removeChild(mainContainer.firstChild);
        }

        // Get bones for current category
        const categoryBones = boneCategories[category].bones;

        // Create sliders only for bones in this category
        categoryBones.forEach((bone, index) => {
          const boneContainer = document.createElement("a-entity");
          // Position each bone's sliders in a grid layout
          const row = Math.floor(index / 4); // 4 columns
          const col = index % 4;
          boneContainer.setAttribute(
            "position",
            `${col * 1.2 - 2} ${-row * 0.4} 0`
          );
          boneContainer.setAttribute("bone-name", bone);
          mainContainer.appendChild(boneContainer);

          // Create sliders for this bone
          this.createSlidersForBone(bone, boneContainer);
        });
      };

      // Create initial sliders for torso category
      createSlidersForCategory("torso");

      // Add change event listener to main container for event delegation
      if (this.sliderEntity) {
        this.sliderEntity.addEventListener("change", this.onSliderChange);
      }
    } else if (!this.data.editor && this.sliderEntity) {
      // Remove change event listener
      this.sliderEntity.removeEventListener("change", this.onSliderChange);
      // Remove slider entity
      this.el.removeChild(this.sliderEntity);
      this.sliderEntity = null;
    }
  },

  loadBVH: function (url) {
    const loader = new BVHLoader();
    loader.load(url, (result) => {
      // Create bone mapping
      const boneMapping = {
        Hip: "mPelvis",
        Spine: "mTorso",
        Chest: "mChest",
        Neck: "mNeck",
        Head: "mHead",
        LeftShoulder: "mCollarLeft",
        LeftArm: "mShoulderLeft",
        LeftForeArm: "mElbowLeft",
        LeftHand: "mWristLeft",
        RightShoulder: "mCollarRight",
        RightArm: "mShoulderRight",
        RightForeArm: "mElbowRight",
        RightHand: "mWristRight",
        LeftUpLeg: "mHipLeft",
        LeftLeg: "mKneeLeft",
        LeftFoot: "mAnkleLeft",
        RightUpLeg: "mHipRight",
        RightLeg: "mKneeRight",
        RightFoot: "mAnkleRight",
        rThigh: "mHipRight",
        rShin: "mKneeRight",
        rFoot: "mAnkleRight",
        lThigh: "mHipLeft",
        lShin: "mKneeLeft",
        lFoot: "mAnkleLeft",
        rShldr: "mShoulderRight",
        rForeArm: "mElbowRight",
        rHand: "mWristRight",
        lShldr: "mShoulderLeft",
        lForeArm: "mElbowLeft",
        lHand: "mWristLeft",
      };

      // Find corresponding bones in avatar
      const avatarBones = {};
      this.avatar.getBones().forEach((bone) => {
        if (Object.values(boneMapping).includes(bone.name)) {
          avatarBones[bone.name] = bone;
        }
      });

      // Create animation mixer for the avatar
      this.mixer = new THREE.AnimationMixer(new Object3D());

      // Modify the animation clip to work with avatar bones
      const tracks = [];
      result.clip.tracks.forEach((track) => {
        const bvhBoneName = track.name.split(".")[0];
        // Find matching bone name regardless of case
        const mappingKey = Object.keys(boneMapping).find(
          (key) => key.toLowerCase() === bvhBoneName.toLowerCase()
        );
        const avatarBoneName = mappingKey ? boneMapping[mappingKey] : null;

        if (avatarBoneName && avatarBones[avatarBoneName]) {
          const newTrack = track.clone();
          newTrack.name = `${avatarBoneName}${track.name.substring(
            track.name.indexOf(".")
          )}`;
          tracks.push(newTrack);
        }
      });

      // Create new animation clip with remapped bones
      const remappedClip = new THREE.AnimationClip(
        "remapped",
        result.clip.duration,
        tracks
      );

      // Play the animation
      const action = this.mixer.clipAction(remappedClip);
      action.play();
      console.log("Playing retargeted BVH animation:", this.data.bvhUrl);
    });
  },

  setupAvatar: async function () {
    try {
      // Get the Three.js scene from A-Frame
      const sceneEl = this.el.sceneEl;
      const scene = sceneEl.object3D;

      // Load the avatar
      await this.avatar.load(scene);

      // Center the model
      const camera = document.querySelector("[camera]").object3D;

      // Setup texture update handlers
      this.setupTextureHandlers();

      // Apply initial textures if provided
      if (this.data.headTexture) {
        this.avatar.updateTexture("head", this.data.headTexture);
      }
      if (this.data.upperTexture) {
        this.avatar.updateTexture("upper", this.data.upperTexture);
      }
      if (this.data.lowerTexture) {
        this.avatar.updateTexture("lower", this.data.lowerTexture);
      }

      // Load BVH animation if provided
      if (this.data.bvhUrl) {
        this.loadBVH(this.data.bvhUrl);
      }
    } catch (error) {
      console.error("Error setting up avatar:", error);
    }
  },

  setupTextureHandlers: function () {
    const slots = document.querySelectorAll(".image-slot");
    slots.forEach((slot) => {
      const type = slot.getAttribute("data-type");
      slot.addEventListener("textureupdate", (event) => {
        this.avatar.updateTexture(type, event.detail.textureUrl);
      });
    });
  },

  update: function (oldData) {
    if (oldData.editor !== this.data.editor) {
      this.updateEditor();
    }
  },

  tick: function (time, timeDelta) {
    if (this.avatar) {
      this.avatar.update();
    }
    if (this.mixer) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);

      // Log animation state for each tracked bone
      if (this.mixer._actions.length > 0) {
        const action = this.mixer._actions[0];
        const tracks = action._clip.tracks;

        tracks.forEach((track) => {
          const boneName = track.name.split(".")[0];
          const propertyName = track.name.split(".")[1];

          // Get current time in the animation
          const time = action.time;

          // Get the current values using interpolation
          const interpolant = track.createInterpolant();
          const values = interpolant.evaluate(time);

          // Find the corresponding bone in the avatar
          const bone = this.avatar.getBones().find((b) => b.name === boneName);
          if (bone) {
            // Apply position or quaternion based on property name
            if (propertyName === "position") {
              // Scale down position values by 100
              // bone.position.fromArray(values.map((v) => v / 100));
            } else if (propertyName === "quaternion") {
              bone.quaternion.fromArray(values);
            }
            bone.updateMatrixWorld(true);
          }

          console.log(`Bone ${boneName} ${propertyName}:`, {
            time: time.toFixed(3),
            values: Array.from(values).map((v) => v.toFixed(3)),
          });
        });
      }
    }
  },

  // Expose avatar methods for external use
  getBones: function () {
    return this.avatar.getBones();
  },

  rotateBone: function (bone, axis, angleRadians) {
    this.avatar.rotateBone(bone, axis, angleRadians);
  },

  scaleBone: function (bone, scale) {
    this.avatar.scaleBone(bone, scale);
  },

  positionBone: function (bone, axis, value) {
    this.avatar.positionBone(bone, axis, value);
  },
});

AFRAME.registerComponent("slider", {
  schema: {
    min: { type: "number", default: 0 },
    max: { type: "number", default: 1 },
    value: { type: "number", default: 0.5 },
    axis: { type: "string", default: "x" },
    sliderWidth: { type: "number", default: 1 },
    sliderHeight: { type: "number", default: 0.05 },
    indicatorRadius: { type: "number", default: 0.08 },
    sliderColor: { type: "color", default: "#666666" },
    indicatorColor: { type: "color", default: "#FF4444" },
  },

  init: function () {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    // Add touch/mouse event listeners
    this.el.addEventListener("mousedown", this.onTouchStart);
    this.el.addEventListener("touchstart", this.onTouchStart);

    // Store initial position
    this.startPosition = new THREE.Vector3();
    this.isDragging = false;

    // Setup raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Create slider base
    const sliderBase = document.createElement("a-box");
    sliderBase.setAttribute("width", this.data.sliderWidth);
    sliderBase.setAttribute("height", this.data.sliderHeight);
    sliderBase.setAttribute("depth", 0);
    sliderBase.setAttribute("color", this.data.sliderColor);
    sliderBase.setAttribute("opacity", 0.5);
    sliderBase.setAttribute("material", "transparent: true");
    this.el.appendChild(sliderBase);

    // Create text indicator
    this.indicator = document.createElement("a-text");
    this.indicator.setAttribute("value", this.data.value.toFixed(2));
    this.indicator.setAttribute("color", this.data.indicatorColor);
    this.indicator.setAttribute("align", "center");
    this.indicator.setAttribute("scale", "0.15 0.15 0.15");
    this.el.appendChild(this.indicator);

    // Set initial value property
    this.el.value = this.data.value;

    // Initial indicator position
    this.updateIndicatorPosition();
  },

  updateIndicatorPosition: function () {
    const range = this.data.max - this.data.min;
    const normalizedValue = (this.data.value - this.data.min) / range;
    const offset = (normalizedValue - 0.5) * this.data.sliderWidth;

    // Update the text value
    this.indicator.setAttribute("value", this.data.value.toFixed(2));

    // Position the text in front of the slider
    if (this.data.axis === "x") {
      this.indicator.setAttribute(
        "position",
        `${offset} ${this.data.sliderHeight} 0`
      );
    } else if (this.data.axis === "y") {
      this.indicator.setAttribute("position", `0 ${offset} 0.1`);
    } else {
      this.indicator.setAttribute(
        "position",
        `0 ${this.data.sliderHeight} ${offset + 0.1}`
      );
    }
  },

  onTouchStart: function (evt) {
    evt.preventDefault();
    this.isDragging = true;

    // Add move and end listeners
    window.addEventListener("mousemove", this.onTouchMove);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("mouseup", this.onTouchEnd);
    window.addEventListener("touchend", this.onTouchEnd);

    // Get intersection point
    const intersection = this.getIntersection(evt);
    if (intersection) {
      this.startPosition.copy(intersection.point);
    } else {
      // Fallback to object position if no intersection
      this.el.object3D.getWorldPosition(this.startPosition);
    }
  },

  onTouchMove: function (evt) {
    if (!this.isDragging) return;

    const intersection = this.getIntersection(evt);
    if (!intersection) return;

    const currentPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(currentPos);

    // Calculate the current position along the slider
    const currentValue =
      this.data.axis === "x"
        ? intersection.point.x
        : this.data.axis === "y"
        ? intersection.point.y
        : intersection.point.z;

    // Get the slider's world position
    const sliderPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(sliderPos);

    // Get parent's world scale
    const worldScale = new THREE.Vector3();
    this.el.object3D.getWorldScale(worldScale);

    // Calculate normalized position (-0.5 to 0.5) accounting for scale
    const normalizedPos =
      (currentValue - sliderPos[this.data.axis]) /
      (this.data.sliderWidth * worldScale[this.data.axis]);

    // Map to value range
    const range = this.data.max - this.data.min;
    const value = THREE.MathUtils.clamp(
      this.data.min + (normalizedPos + 0.5) * range,
      this.data.min,
      this.data.max
    );

    // Update the component's value
    this.el.setAttribute("slider", "value", value);
    this.updateIndicatorPosition();

    // Set the value property on the element
    this.el.value = value;

    // Emit change event with the new value
    this.el.emit("change", { value: value });
  },

  onTouchEnd: function () {
    this.isDragging = false;

    // Remove move and end listeners
    window.removeEventListener("mousemove", this.onTouchMove);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("mouseup", this.onTouchEnd);
    window.removeEventListener("touchend", this.onTouchEnd);

    console.log("Slider touch end");
  },

  getMouseFromEvent: function (evt) {
    const bounds = evt.target.getBoundingClientRect();
    const x = ((evt.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = -((evt.clientY - bounds.top) / bounds.height) * 2 + 1;
    return new THREE.Vector2(x, y);
  },

  getMoveEventDetails: function (evt, currentPos, intersection) {
    return {
      type: evt.type,
      clientX: evt.clientX,
      clientY: evt.clientY,
      currentPosition: currentPos.clone(),
      intersection: intersection
        ? {
            point: intersection.point,
            distance: intersection.distance,
          }
        : null,
    };
  },

  getIntersection: function (evt) {
    // Get normalized mouse coordinates
    this.mouse.copy(this.getMouseFromEvent(evt));

    // Setup raycaster with camera
    const cameraEl = document.querySelector("[camera]");
    const camera = cameraEl.getObject3D("camera");
    this.raycaster.setFromCamera(this.mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObject(this.el.object3D, true);

    return intersects.length > 0 ? intersects[0] : null;
  },

  remove: function () {
    // Clean up event listeners
    this.el.removeEventListener("mousedown", this.onTouchStart);
    this.el.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("mousemove", this.onTouchMove);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("mouseup", this.onTouchEnd);
    window.removeEventListener("touchend", this.onTouchEnd);
  },
});