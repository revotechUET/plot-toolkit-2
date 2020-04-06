import VObject from "../v-object";
import { Graphics } from "pixi.js";
import {
  getColor,
  DefaultColors,
  getTransparency,
  getPosX,
  getPosY
} from "../utils";
function createPixiObj() {
  return new Graphics();
}
function getMaskObj() {
  if (!this.clipped) return null;
  if (!this.maskObj) {
    if (this.$parent) {
      this.maskObj = new Graphics();
      let parentObj = this.$parent.getPixiObj();
      parentObj.addChild(this.maskObj);
    } else return null;
  }
  return this.maskObj;
}
function registerEvents(_pixiObj) {
  let pixiObj = _pixiObj || this.getPixiObj();
  if (this.enabled) {
    pixiObj.interactive = true;
    //pixiObj.buttonMode = true;
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
    if (this.draggable) this.dragStart(currentTarget, localPos, globalPos);
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
    if (this.draggable) this.dragMove(evt.data, currentTarget);
  };
  pixiObj
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("mousedown", handleMouseDown)
    .on("mouseup", handleMouseUp)
    .on("mouseupoutside", handleMouseUp)
    .on("mousemove", handleMouseMove);
}
function dragStart(target, localPos, globalPos) {
  console.log("dragStart", localPos.x, localPos.y);
  this.dragging = true;
  this.draggingData.x = localPos.x;
  this.draggingData.y = localPos.y;
  this.draggingData.globalX = globalPos.x - localPos.x;
  this.draggingData.globalY = globalPos.y - localPos.y;

  let childIdx = this.pixiObj.parent.getChildIndex(this.pixiObj);
  this.draggingData.childIdx = childIdx;
  this.pixiObj.parent.removeChild(this.pixiObj);
  this.getRoot().addChild(this.pixiObj);
  this.pixiObj.x = globalPos.x - localPos.x;
  this.pixiObj.y = globalPos.y - localPos.y;
  requestAnimationFrame(() => this.rawRenderGraphic());

  this.onDrag && this.onDrag(target);
}
function dragEnd(evtData, target) {
  if (!this.dragging) return;
  this.dragging = false;
  //this.pixiObj.zIndex = this.draggingData.zIndex;
  this.getRoot().removeChild(this.pixiObj);
  this.$parent
    .getPixiObj()
    .addChildAt(this.pixiObj, this.draggingData.childIdx);
  this.makeScene();
  let newPos = this.normalizePos(target.parent.toLocal(evtData.global));
  newPos.x -= this.draggingData.x;
  newPos.y -= this.draggingData.y;
  if (this.dragConstraint === "x") {
    this.onDrop && this.onDrop(target, { x: newPos.x });
  } else if (this.dragConstraint === "y") {
    this.onDrop && this.onDrop(target, { y: newPos.y });
  } else {
    this.onDrop && this.onDrop(target, newPos);
  }
  this.draggingData = {};
}
/*
function dragEnd1(evtData, target) {
    if (!this.dragging) return;
    this.dragging = false;
    this.pixiObj.zIndex = this.draggingData.zIndex;
    this.makeScene();
    let newPos = this.normalizePos(target.parent.toLocal(evtData.global));
    newPos.x -= this.draggingData.x;
    newPos.y -= this.draggingData.y;
    if (this.dragConstraint === 'x') {
        this.onDrop && this.onDrop(target, {x:newPos.x});
    }
    else if (this.dragConstraint === 'y') {
        this.onDrop && this.onDrop(target, {y: newPos.y});
    }
    else {
        this.onDrop && this.onDrop(target, newPos);
    }
    this.draggingData = {};
}
*/
function dragMove(evtData, target) {
  if (this.dragging) {
    let pPos = this.$parent.getPixiObj().toLocal(evtData.global);
    let newPos = this.normalizePos(pPos);
    let newGlobal = this.$parent.getPixiObj().toGlobal(newPos);
    const x = newGlobal.x - this.draggingData.x;
    const y = newGlobal.y - this.draggingData.y;
    requestAnimationFrame(() => {
      if (this.dragConstraint === "y") {
        this.pixiObj.y = y;
        this.pixiObj.x = this.draggingData.globalX;
        if (this.maskObj) {
          this.maskObj.y = y;
          this.maskObj.x = this.draggingData.globalX;
        }
      } else if (this.dragConstraint === "x") {
        this.pixiObj.x = x;
        this.pixiObj.y = this.draggingData.globalY;
        if (this.maskObj) {
          this.maskObj.x = x;
          this.maskObj.y = this.draggingData.globalY;
        }
      } else {
        this.pixiObj.x = x;
        this.pixiObj.y = y;
        if (this.maskObj) {
          this.maskObj.x = x;
          this.maskObj.y = y;
        }
      }
      this.rawRenderGraphic();
    });
  }
}
function dragMove1(evtData, target) {
  if (this.dragging) {
    let pPos = this.pixiObj.parent.toLocal(evtData.global);
    let newPos = this.normalizePos(pPos);
    console.log(newPos, pPos, evtData.global);
    const x = newPos.x - this.draggingData.x;
    const y = newPos.y - this.draggingData.y;
    requestAnimationFrame(() => {
      if (this.dragConstraint === "y") {
        this.pixiObj.y = y;
        if (this.maskObj) this.maskObj.y = y;
      } else if (this.dragConstraint === "x") {
        this.pixiObj.x = x;
        if (this.maskObj) this.maskObj.x = x;
      } else {
        this.pixiObj.x = x;
        this.pixiObj.y = y;
        if (this.maskObj) {
          this.maskObj.x = x;
          this.maskObj.y = y;
        }
      }
      this.rawRenderGraphic();
    });
  }
}
function normalizePos(pos) {
  if (!this.dragLimits) return pos;
  let bound;
  if (typeof this.dragLimits === "function") {
    return this.dragLimits(pos, this);
  } else if (this.dragLimits === "parent") {
    bound = {
      x: this.$parent.posX,
      y: this.$parent.posY,
      width: this.$parent.width,
      height: this.$parent.height
    };
  } else if (this.dragLimits.constructor.name === "VueComponent") {
    bound = {
      x: this.dragLimits.posX || 0,
      y: this.dragLimits.posY || 0,
      width: this.dragLimits.width,
      height: this.dragLimits.height
    };
  }
  if ((pos.x - bound.x) * (pos.x - bound.x - bound.width) > 0) {
    return { y: pos.y, x: pos.x < bound.x ? bound.x : bound.x + bound.width };
  }
  if ((pos.y - bound.y) * (pos.y - bound.y - bound.height) > 0) {
    return { x: pos.x, y: pos.y < bound.y ? bound.y : bound.y + bound.height };
  }
  return pos;
}
  /*
function draw(obj) {
  obj.clear();
  let lw = this.lineWidth || 1;
  let lt = this.lineTransparency || 1.0;
  if (this.hasMouseOver) {
      lw += 4;
      lt /= 2;
  }
  obj.lineStyle(lw, getColor(this.lineColor, DefaultColors.lineColor), lt, 0);
  obj.beginFill(getColor(this.fillColor, DefaultColors.fillColor), getTransparency(this.fillTransparency));
  switch (this.shape) {
      case 'rect':
          obj.drawRect(0, 0, this.width || 0, this.height || 0);
          break;
      case 'circle':
          obj.drawCircle(0, 0, this.radius || 0);
          break;
      case 'polygon':
          obj.drawPolygon(this.path || []);
          break;
      default:
          console.error('Unknown shape type');
  }
  obj.endFill();
  obj.x = getPosX(this.coordinate, this.posX);
  obj.y = getPosY(this.coordinate, this.posY);
  obj.rotation = this.rotation || 0;
}
  */
const propKeys = [
  "shape",
  "clipped",
  "enabled",
  "width",
  "height",
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
  "draggable",
  "dragConstraint",
  "dragLimits",
  "onDrag",
  "onDrop"
];
let component = {
  props: propKeys,
  data: function() {
    return {
      hasMouseOver: false,
      dragging: false,
      draggingData: {}
    };
  },
  computed: {
    watchedKeys: function() {
      return ["hasMouseOver", ...Object.keys(this.$props)].filter(
        v => v !== "dragLimits"
      );
    }
  },
  methods: {
    createPixiObj,
    getMaskObj,
    registerEvents,
    //draw,
    dragStart,
    dragEnd,
    dragMove,
    normalizePos
  }
};

export default VObject.extend(component);
