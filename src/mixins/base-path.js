import { getColor, DefaultValues, getPosX, getPosY } from "../utils";
import baseShape from './base-shape';

function draw(obj) {
  obj.clear();
  let lw = this.lineWidth || 1;
  let lt = this.lineTransparency || 1.0;
  let symbolColor = this.symbolColor;

  if (this.hasMouseOver) {
    lw += 2;
    lt /= 2;
  }
  obj.lineStyle(lw, getColor(symbolColor, DefaultValues.lineColor), lt, 0.5);

  let points = this.getPath();
  let symbolSize =
    typeof this.symbolSize === "string"
      ? parseInt(this.symbolSize)
      : this.symbolSize || 5;

  if (this.dashLine && this.lineDash !== "[0]") {
    obj.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      if (i < points.length - 1 && !this.realPath[i].x) {
        obj.moveTo(points[i + 1].x, points[i + 1].y)
      } else {
        obj.myLineTo(points[i].x, points[i].y, this.lineDash);
      }
    }
  } else {
    obj.moveTo(points[0].x, points[0].y);
    this.myDrawPath(points);
  }

  obj.beginFill(symbolColor, 1);
  switch (this.symbolShape) {
    case "square":
      for (let i = 0; i < points.length; i++) {
        var edge = symbolSize * 2;
        obj.drawRect(
          points[i].x - edge / 2,
          points[i].y - edge / 2,
          edge,
          edge
        );
      }
      break;
    case "circle":
      for (let i = 0; i < points.length; i++) {
        obj.drawCircle(points[i].x, points[i].y, symbolSize);
      }
      break;
    case "star":
      for (let i = 0; i < points.length; i++) {
        obj.drawStar(points[i].x, points[i].y, 5, symbolSize * 2, 0);
      }
      break;
    case "plus":
      for (let i = 0; i < points.length; i++) {
        obj.drawPlus(points[i].x, points[i].y, symbolSize);
      }
      break;
    default:
    // console.error("Unknown shape type");
  }

  obj.endFill();
  obj.x = getPosX(this.coordinate, this.posX);
  obj.y = getPosY(this.coordinate, this.posY);
  obj.rotation = this.rotation || 0;
}

export default {
  props: [
    "symbolShape",
    "viewPath",
    "realPath",
    "symbolSize",
    "symbolColor",
    "lineDash",
    "shadingOffsetX",
    "shadingOffsetY",
    "wrapMode"
  ],
  computed: {
    componentType: function () {
      return "VPath";
    },
    dashLine: function () {
      return !!this.lineDash;
    },
  },
  methods: {
    draw,
    getPath: function (offsetX, offsetY) {
      if (this.viewPath) return this.viewPath;
      if (isNaN(this.realPath) && !this.realPath) return [];
      let transformXFn = this.getTransformX() || this.$parent.getTransformX();
      let transformYFn = this.getTransformY() || this.$parent.getTransformY();
      if (!transformXFn || !transformYFn) return [];
      if (!isNaN(this.realPath)) {
        return [
          {
            x: transformXFn(this.realPath) - (this.shadingOffsetX || offsetX || 0),
            y: transformYFn(this.realMinY || this.$parent.realMinY)
          },
          {
            x: transformXFn(this.realPath) - (this.shadingOffsetX || offsetX || 0),
            y: transformYFn(this.realMaxY || this.$parent.realMaxY)
          },
        ]
      } else {
        return this.realPath.map((point) => ({
          x: transformXFn(point.x) - (this.shadingOffsetX || offsetY || 0),
          y: transformYFn(point.y) - (this.shadingOffsetY || offsetY || 0),
        }));
      }
    },
    myDrawPath: function (points) {
      let obj = this.getPixiObj();
      let i = 1;
      while (i < points.length) {
        let wrapFlag = false;
        switch (this.wrapMode) {
          case "Left":
            if (points[i].x > this.viewWidth) {
              wrapFlag = true;
              obj.lineTo(points[i].x, points[i].y);
              obj.moveTo(0, points[i].y);
              while (points[i].x >= this.viewWidth) {
                obj.lineTo(points[i].x - this.viewWidth, points[i].y);
                i++;
              }
              i < points.length && obj.lineTo(points[i].x - this.viewWidth, points[i].y);
              obj.moveTo(points[i - 1].x, points[i - 1].y);
            }
            break;
          case "Right":
            if (points[i].x < 0) {
              wrapFlag = true;
              obj.lineTo(points[i].x, points[i].y);
              obj.moveTo(this.viewWidth, points[i].y);
              while (i < points.length && points[i].x <= 0) {
                obj.lineTo(points[i].x + this.viewWidth, points[i].y);
                i++;
              }
              i < points.length && obj.lineTo(points[i].x + this.viewWidth, points[i].y);
              obj.moveTo(points[i - 1].x, points[i - 1].y);
            }
            break;
          case "Both":
            if (points[i].x < 0) {
              wrapFlag = true;
              obj.lineTo(points[i].x, points[i].y);
              obj.moveTo(this.viewWidth, points[i].y);
              while (i < points.length && points[i].x <= 0) {
                obj.lineTo(points[i].x + this.viewWidth, points[i].y);
                i++;
              }
              i < points.length && obj.lineTo(points[i].x + this.viewWidth, points[i].y);
              obj.moveTo(points[i - 1].x, points[i - 1].y);
            } else if (points[i].x > this.viewWidth) {
              wrapFlag = true;
              obj.lineTo(points[i].x, points[i].y);
              obj.moveTo(0, points[i].y);
              while (points[i].x >= this.viewWidth) {
                obj.lineTo(points[i].x - this.viewWidth, points[i].y);
                i++;
              }
              i < points.length && obj.lineTo(points[i].x - this.viewWidth, points[i].y);
              obj.moveTo(points[i - 1].x, points[i - 1].y);
            }
            break;
          case "None":
            break;
        }
        if (!wrapFlag) {
          if (i < points.length - 1 && !this.realPath[i].x) {
            obj.moveTo(points[i + 1].x, points[i + 1].y)
          } else {
            obj.lineTo(points[i].x, points[i].y)
          }
          i++;
        }
      }
    }
  },
  mixins: [baseShape],
}