import VShape from "../v-shape";
import {
	getColor,
	DefaultValues,
	getTransparency,
	getPosX,
	getPosY,
} from "../utils";
import layoutMixin from '../mixins/layout';

function drawRect(obj, align = 0) {
  obj.clear();
  let lw = this.lineWidth || 0;
  let lt = this.lineTransparency || 1.0;
  if (this.hasMouseOver) {
    lw = lw?(lw + 4):0;
    lt /= 2;
  }
  obj.lineStyle(lw, getColor(this.lineColor, DefaultValues.lineColor), lt, align);

	obj.beginFill(
		getColor(this.fillColor, DefaultValues.fillColor),
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
    drawRect,
    draw: drawRect
  },
  mixins: [layoutMixin]
};
export default VShape.extend(component);