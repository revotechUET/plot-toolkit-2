import VObject from "../v-object";
// import {getColor, DefaultColors, getTransparency, getPosX, getPosY} from '../utils';
function registerEvents(_pixiObj) {
  let pixiObj = _pixiObj || this.getPixiObj();
  if (this.enabled) {
    pixiObj.interactive = true;
    pixiObj.buttonMode = true;
  }

  const handleMouseOver = evt => {
    this.hasMouseOver = true;
    this.onmouseover &&
      this.onmouseover(
        evt.currentTarget,
        evt.currentTarget.toLocal(evt.data.global),
        evt.data.global,
        evt
      );
  };
  const handleMouseOut = evt => {
    this.hasMouseOver = false;
    this.onmouseout &&
      this.onmouseout(
        evt.currentTarget,
        evt.currentTarget.toLocal(evt.data.global),
        evt.data.global,
        evt
      );
  };
  const handleMouseDown = evt => {
    let currentTarget = evt.currentTarget;
    let globalPos = evt.data.global;
    let localPos = currentTarget.toLocal(globalPos);
    this.onmousedown &&
      this.onmousedown(currentTarget, localPos, globalPos, evt);
    if (this.draggable) this.dragStart(localPos, currentTarget);
  };
  const handleMouseUp = evt => {
    let currentTarget = evt.currentTarget;
    let globalPos = evt.data.global;
    this.onmouseup &&
      this.onmouseup(
        currentTarget,
        currentTarget.toLocal(globalPos),
        globalPos,
        evt
      );
    if (this.draggable) this.dragEnd(evt.data, currentTarget);
  };
  const handleMouseMove = evt => {
    let currentTarget = evt.currentTarget;
    let globalPos = evt.data.global;
    this.onmousemove &&
      this.onmousemove(
        currentTarget,
        currentTarget.toLocal(globalPos),
        globalPos,
        evt
      );
    if (this.draggable) this.dragMove(evt.data);
  };
  pixiObj
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("mousedown", handleMouseDown)
    .on("mouseup", handleMouseUp)
    .on("mouseupoutside", handleMouseUp)
    .on("mousemove", handleMouseMove);
}
function dragStart(localPos, target) {
  console.log("dragStart", localPos.x, localPos.y);
  this.dragging = true;
  this.draggingData.x = localPos.x;
  this.draggingData.y = localPos.y;
  this.draggingData.zIndex = this.pixiObj.zIndex;
  this.pixiObj.zIndex = 1000;
  this.onDrag && this.onDrag(target);
}
function dragEnd(evtData, target) {
  if (!this.dragging) return;
  this.dragging = false;
  this.pixiObj.zIndex = this.draggingData.zIndex;
  this.draggingData = {};
  this.makeScene();
  this.onDrop && this.onDrop(target, evtData.global);
}
function dragMove(evtData) {
  if (this.dragging) {
    const x = evtData.global.x - this.draggingData.x;
    const y = evtData.global.y - this.draggingData.y;
    console.log("dragMove", this.coordinate.x, this.coordinate.y);
    requestAnimationFrame(() => {
      this.pixiObj.x = x;
      this.pixiObj.y = y;
      if (this.maskObj) {
        this.maskObj.x = x;
        this.maskObj.y = y;
      }
      this.renderGraphic();
    });
  }
}
function draw(obj) {
  // obj.clear();
  // let lw = this.lineWidth || 1;
  // let lt = this.lineTransparency || 1.0;
  // if (this.hasMouseOver) {
  //     lw += 4;
  //     lt /= 2;
  // }
  // obj.lineStyle(lw, getColor(this.lineColor, DefaultColors.lineColor), lt, 0);
  // obj.beginFill(getColor(this.fillColor, DefaultColors.fillColor), getTransparency(this.fillTransparency));
  // switch (this.shape) {
  //     case 'rect':
  //         obj.drawRect(0, 0, this.width || 0, this.height || 0);
  //         break;
  //     case 'circle':
  //         obj.drawCircle(0, 0, this.radius || 0);
  //         break;
  //     case 'polygon':
  //         obj.drawPolygon(this.path || []);
  //         break;
  //     default:
  //         console.error('Unknown shape type');
  // }
  // obj.endFill();
  // obj.x = getPosX(this.coordinate, this.posX);
  // obj.y = getPosY(this.coordinate, this.posY);
  // obj.rotation = this.rotation || 0;
}
const propKeys = [
  "shape",
  "clipped",
  "enabled",
  "draggable",
  "radius",
  "path",
  "lineWidth",
  "lineColor",
  "lineTransparency",
  "fillColor",
  "fillTransparency",
  "onmousedown",
  "onmouseup",
  "onmouseover",
  "onmouseover",
  "onmouseout",
  "onmousemove",
  "onDrag",
  "onDrop"
];
let component = {
  props: propKeys,
  data: function() {
    return {
      hasMouseOver: false,
      dragging: false,
      draggingData: {},
      coordinate: {}
    };
  },
  mounted: function() {
    this.makeScene();
    this.registerEvents();
  },
  computed: {
    compProps: function() {
      let array = [
        this.baseCompProps,
        this.hasMouseOver,
        (this.pixiObj || {}).zIndex
      ];
      propKeys.forEach(k => {
        if (typeof this[k] !== "function") array.push(this[k]);
      });
      return array.join("|");
    }
  },
  methods: {
    registerEvents,
    draw,
    dragStart,
    dragEnd,
    dragMove
  }
};
export default VObject.extend(component);
