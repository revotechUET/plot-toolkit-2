import VShape from "../v-shape";
import { Loader, Texture, Sprite, SCALE_MODES  } from "pixi.js";

function draw(obj, align = 0) {
    obj.clear();
    let lw = this.lineWidth || 1;
    obj.lineStyle(lw, "#000", 1, align);
    obj.drawRect(0, 0, this.width || 0, this.height || 0);

    if (this.imageUrl) {
        obj.removeChild(this.sprite);

        let loader = new Loader();
        loader.add(this.imageUrl, this.imageUrl);
        loader.load((loader, resources) => {
            this.sprite = Sprite.from(resources[this.imageUrl].texture);
            if (this.scaled) {
                this.sprite.width = this.width;
                this.sprite.height = this.height;
            }
            else {
                if (this.centering) {
                    let tranX = (this.width/2 - this.sprite.width/2);
                    let tranY = (this.height/2 - this.sprite.height/2);
                    this.sprite.x = tranX;
                    this.sprite.y = tranY;
                }
                this.sprite.mask = this.getMaskObj();
            }
            obj.addChildAt(this.sprite, 0);
        });
    }
}
function drawMask(obj, align = 0) {
    obj.clear();
    let lw = this.lineWidth || 1;
    obj.lineStyle(lw, "#000", 1, align);
    obj.beginFill(0x000000, 1);
    obj.drawRect(0, 0, this.width || 0, this.height || 0);
    obj.endFill();
}

let component = {
    props: ['imageUrl', "scaled", "centering"],
    computed: {
        componentType: function() {
            return this.componentTypePrefix + " VImage";
        }
    },
    methods: {
        draw,
        drawMask
        // getPixiObj
    },
};
let VImage = VShape.extend(component);
export function VImageFactory(opts) {
	return factoryFn(VImage, opts);
}
export default VImage;