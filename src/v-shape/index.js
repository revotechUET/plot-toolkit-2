import VObject from "../v-object";
import { Texture } from "pixi.js";
import {
    blendColorImage,
    getImagePattern
} from "../utils";
import Graphics from "../extensions";
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
        //pixiObj.buttonMode        =        true;
    }

    const handleMouseOver = evt => {
        if (this.highlight)
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
        if (this.draggable) {
            evt.stopPropagation();
            this.dragStart(currentTarget, localPos, globalPos, evt.data.originalEvent);
        }
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
        if (this.draggable) {
            evt.stopPropagation();
            this.dragEnd(evt.data, currentTarget);
        }
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
function dragStart(target, localPos, globalPos, oriEvent) {
    console.log("dragStart", localPos.x, localPos.y, globalPos, oriEvent);
    if (target.locked) return;
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
    console.log('drag in shape')
    if (!this.dragging) return;
    this.dragging = false;
    //this.pixiObj.zIndex        =        this.draggingData.zIndex;
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
function dragMove(evtData, target) {
    if (this.dragging) {
        let pPos = this.$parent.getPixiObj().toLocal(evtData.global);
        let pStartPos = this.$parent.getPixiObj().toLocal({ x: this.draggingData.globalX, y: this.draggingData.globalY })
        let newPos = this.normalizePos(pPos);
        let newGlobal = this.$parent.getPixiObj().toGlobal(newPos);
        const x = newGlobal.x - this.draggingData.x;
        const y = newGlobal.y - this.draggingData.y;
        const px = newPos.x - this.draggingData.x;
        const py = newPos.y - this.draggingData.y;
        requestAnimationFrame(() => {
            if (this.dragConstraint === "y") {
                this.pixiObj.y = y;
                this.pixiObj.x = this.draggingData.globalX;
                if (this.maskObj) {
                    this.maskObj.y = py;
                    this.maskObj.x = pStartPos.x;
                }
            } else if (this.dragConstraint === "x") {
                this.pixiObj.x = x;
                this.pixiObj.y = this.draggingData.globalY;
                if (this.maskObj) {
                    this.maskObj.x = px;
                    this.maskObj.y = pStartPos.y;
                }
            } else {
                this.pixiObj.x = x;
                this.pixiObj.y = y;
                if (this.maskObj) {
                    this.maskObj.x = px;
                    this.maskObj.y = py;
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
            height: this.$parent.height,
        };
    } else if (this.dragLimits.constructor.name === "VueComponent") {
        bound = {
            x: this.dragLimits.posX || 0,
            y: this.dragLimits.posY || 0,
            width: this.dragLimits.width,
            height: this.dragLimits.height,
        };
    }
    if ((pos.x - bound.x) * (pos.x - bound.x - bound.width) > 0) {
        return {
            y: pos.y,
            x: pos.x < bound.x ? bound.x : bound.x + bound.width,
        };
    }
    if ((pos.y - bound.y) * (pos.y - bound.y - bound.height) > 0) {
        return {
            x: pos.x,
            y: pos.y < bound.y ? bound.y : bound.y + bound.height,
        };
    }
    return pos;
}
const propKeys = [
    "shape",
    "clipped",
    "enabled",
    "highlight",
    "radius",
    "lineWidth",
    "lineColor",
    "lineTransparency",
    "fillColor",
    "noFill",
    "fillTransparency",
    'imagePatternUrl', 'foregroundColor', 'backgroundColor',
    "onmousedown",
    "onmouseup",
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
    data: function () {
        return {
            hasMouseOver: false,
            dragging: false,
            draggingData: {},
        };
    },
    computed: {
        watchedKeys: function () {
            return ["hasMouseOver", ...Object.keys(this.$props)].filter(
                (v) => v !== "dragLimits"
            );
        },
        textureProps: function () {
            return `${this.imagePatternUrl}-${this.foregroundColor}-${this.backgroundColor}`;
        }
    },
    methods: {
        createPixiObj,
        getMaskObj,
        registerEvents,
        dragStart,
        dragEnd,
        dragMove,
        normalizePos,
        buildTexture: function () {
            if (this.imagePatternUrl) {
                return getImagePattern(this.imagePatternUrl).then((imagePattern) => {
                    let canvas = blendColorImage(imagePattern, this.cForegroundColor, this.cBackgroundColor);
                    this.fillTexture = Texture.from(canvas);
                    return this.fillTexture;
                });
            }
            else {
                return new Promise((resolve) => {
                    this.fillTexture = null;
                    resolve(null);
                });
            }
        }
    },
    watch: {
        textureProps: function () {
            this.buildTexture().then(() => this.makeScene()).catch((err) => {
                console.error(err.message);
                this.makeScene();
            });
        }
    },
    mounted() {
        // console.log(this.$vnode);
    }
};

export default VObject.extend(component);
