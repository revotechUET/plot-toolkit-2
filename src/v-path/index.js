import VShape from "../v-shape";
import {
  getColor,
  DefaultColors,
  getTransparency,
  getPosX,
  getPosY
} from "../utils";

function draw(obj) {
  obj.clear();
  let lw = this.lineWidth || 1;
  let lt = this.lineTransparency || 1.0;
  if (this.hasMouseOver) {
    lw += 4;
    lt /= 2;
  }
  obj.lineStyle(lw, getColor(this.lineColor, DefaultColors.lineColor), lt, 0);

  obj.beginFill(
    getColor(this.fillColor, DefaultColors.fillColor),
    getTransparency(this.fillTransparency)
  );

  var points = this.path;

  obj.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    obj.lineTo(points[i].x, points[i].y);
  }
  obj.beginFill(0xde3249, 1);
  switch (this.symbolShape) {
    case "square":
      for (let i = 0; i < points.length; i++) {
        var edge = 10;
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
        obj.drawCircle(points[i].x, points[i].y, 5);
      }
      break;
    case "star":
      for (let i = 0; i < points.length; i++) {
        obj.drawStar(points[i].x, points[i].y, 5, 10, 0);
      }
      break;
    default:
      console.error("Unknown shape type");
  }

  obj.endFill();
  obj.x = getPosX(this.coordinate, this.posX);
  obj.y = getPosY(this.coordinate, this.posY);
  obj.rotation = this.rotation || 0;
}

let component = {
  props: ["symbolShape"],
  methods: {
    draw
  }
};
export default VShape.extend(component);
