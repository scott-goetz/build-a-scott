<template>
  <section id="face-machine">
    <canvas ref="renderCanvas"></canvas>
  </section>
</template>

<script>
import * as PIXI from 'pixi.js';
import FaceMachinePanel from './FaceMachinePanel.vue';

export default {
  name: 'FaceMachine',
  props: {
    faces: Array,
    version: String
  },
  components: {
    FaceMachinePanel
  },
  methods: {
    draw() {
      console.info('DRAW');
    },
    generateFaces(version) {
      this.$data.shuffledFaces.map((currFace) => {
        const currFacePanel = [];

        this.$data.panelHeights.map((currPanelHeight, index) => {
          const padIndex = ('' + (index + 1)).padStart(2, '0');
          const currFaceId = `${currFace}-${padIndex}-${version}`;
          const currFacePath = `${this.$data.imageRoot}/${currFaceId}.${this.$data.imageFormat}`;
          currFacePanel.push(currFacePath);
        });

        this.panels[currFace] = currFacePanel;
      });
    },
    setup() {
      console.info('SETUP');

      let panelCount = 0;
      let panelPosY = 0;

      for (const panel in this.panels) {
        const currPanelImages = this.panels[panel];
        const panelHeightPercent = this.panelHeights[panelCount] / this.imageDimensions.height;
        const panelHeight = this.$refs.renderCanvas.height * panelHeightPercent;
        let imageCount = 0;

        console.info(panel, currPanelImages);

        // Container for current slot sprites
        this.slots[panelCount] = new PIXI.Container();
        this.slots[panelCount].x = 0;
        this.slots[panelCount].index = panelCount; // Necessary for dragging

        for (const key in currPanelImages) {
          // const spriteTexture = this.loader.resources[key].texture;
          console.info('Key:', key);
          console.info('CurrPanelImage: ', currPanelImages[key]);
          console.info('Loader Resources:', this.loader.resources);
          // Add, position and scale image
          // let currSprite = new PIXI.Sprite(spriteTexture);
          // currSprite.scale.x = currSprite.scale.y = scaleDiff;
          // currSprite.x = newImageWidth * imageCount;
          // currSprite.y = 0;
        }

        panelPosY = panelPosY + panelHeight;
        panelCount++;
        console.info('+++');
      }

      console.info('Slots: ', this.slots);
      console.info('----');
    },
    shuffle(arr) {
      var currentIndex = arr.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
      }

      return arr;
    }
  },
  data() {
    return {
      slots: [],
      currSlotImages: {},
      images: {},
      imageDimensions: {
        width: 1280,
        height: 730
      },
      imageFormat: 'jpg',
      imageRoot: '/media/images/scott',
      loader: PIXI.loader,
      panels: {},
      panelHeights: [181, 159, 95, 95, 200],
      PIXIWrapper: {
        PIXI,
        PIXIApp: null
      },
      shuffledFaces: [],
      stage: new PIXI.Container()
    };
  },
  mounted() {
    const renderCanvas = this.$refs.renderCanvas;
    const w = renderCanvas.offsetWidth;
    const h = renderCanvas.offsetHeight;

    this.PIXIWrapper.PIXIApp = new PIXI.Application(w, h, {
      view: renderCanvas,
      antialiasing: false,
      autoResize: true,
      preserveDrawingBuffer: true, // Need this for image saving
      resolution: 1,
      transparent: false
    });

    console.info('MOUNTED');
    this.shuffledFaces = this.shuffle(this.faces);
    this.generateFaces(this.version);

    // Load all Scott images
    for (const key in this.panels) {
      console.group('load ' + key);
      console.info(this.panels[key]);
      this.loader.add(key, this.panels[key]);
      console.groupEnd();
    }

    this.loader.load(this.setup);

    console.info('======');
  }
};
</script>

<style lang="scss" scoped>
#face-machine {
  width: 100%;
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  @include flexDisplay();
  @include flexDirection(column);
  font-size: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  &:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .instructions {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 50%;
    left: 50%;
    @include translate(-50%, -50%);
    z-index: 10;
  }
}
</style>
