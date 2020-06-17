import VShape from "../v-shape";
import { Loader, Texture, Sprite, SCALE_MODES  } from "pixi.js";

function isDataURL(s) {
    return !!s.match(isDataURL.regex);
}
isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

async function draw(obj, align = 0) {
    obj.clear();
    let lw = this.lineWidth || 1;
    obj.lineStyle(lw, "#000", 1, align);
    obj.drawRect(0, 0, this.width || 0, this.height || 0);

    if (this.imageUrl) {
        let imageBase64Data = this.imageUrl;
        if (!isDataURL(imageBase64Data)) {
            imageBase64Data = await new Promise(resolve => {
                const xhr = new XMLHttpRequest;
                xhr.responseType = 'blob';

                xhr.onload = function () {
                    var recoveredBlob = xhr.response;
                    const reader = new FileReader();
                    reader.readAsDataURL(recoveredBlob);
                    reader.onloadend = function () {
                        resolve(reader.result);
                    }
                };

                xhr.open('GET', imageBase64Data);
                xhr.send();
            })
        }

        // let loader = new Loader();
        // loader.add(this.imageUrl, imageBase64Data);
        // loader.load((loader, resources) => {
            // console.log(resources);
            // this.sprite = Sprite.from(resources[this.imageUrl].texture);
            obj.removeChild(this.sprite);
            this.sprite = Sprite.from(imageBase64Data);
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
        // });
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