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
  let lw = this.lineWidth || 0;
  let lt = this.lineTransparency || 1.0;
  if (this.hasMouseOver) {
    lw = lw?(lw + 4):0;
    lt /= 2;
  }
  obj.lineStyle(lw, getColor(this.lineColor, DefaultColors.lineColor), lt, 0);

  obj.beginFill(
    getColor(this.fillColor, DefaultColors.fillColor),
    getTransparency(this.fillTransparency)
  );

  obj.drawRect(0, 0, this.width || 0, this.height || 0);

  obj.endFill();
  obj.x = getPosX(this.coordinate, this.posX);
  obj.y = getPosY(this.coordinate, this.posY);
  obj.rotation = this.rotation || 0;
}

let component = {
  computed: {
    componentType: function() {return "VRect"}
  },
  methods: {
    draw
  }
};
export default VShape.extend(component);
