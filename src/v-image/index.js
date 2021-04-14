import VShape from "../v-shape";
import { Loader, Texture, Sprite, SCALE_MODES } from "pixi.js";

function isDataURL(s) {
    return !!s.match(isDataURL.regex);
}
isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

function draw(obj, align = 0) {
    obj.clear();
    let lw = this.lineWidth || 1;
    obj.lineStyle(lw, "#000", 1, align);
    obj.drawRect(0, 0, this.width || 0, this.height || 0);

    if (!this.imageBase64Data) this.handleImageUrlChange(this.imageUrl);
    if (this.imageBase64Data) {
        obj.removeChild(this.sprite);
        this.sprite = Sprite.from(this.imageBase64Data);
        if (this.scaled) {
            this.sprite.width = this.width;
            this.sprite.height = this.height;
        }
        else {
            if (this.centering) {
                let tranX = (this.width / 2 - this.sprite.width / 2);
                let tranY = (this.height / 2 - this.sprite.height / 2);
                this.sprite.x = tranX;
                this.sprite.y = tranY;
            }
            this.sprite.mask = this.getMaskObj();
        }
        obj.addChildAt(this.sprite, 0);
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
    data: function () {
        return {
            imageBase64Data: null
        }
    },
    computed: {
        componentType: function () {
            return this.componentTypePrefix + " VImage";
        },
        watchedKeys: function () {
            return ["imageBase64Data", ...Object.keys(this.$props)].filter(
                (v) => v !== "dragLimits"
            );
        },
    },
    methods: {
        draw,
        drawMask,
        handleImageUrlChange: function (imageUrl) {
            if (this.imageUrl) {
                this.imageBase64Data = this.imageUrl;
                if (!isDataURL(this.imageBase64Data)) {
                    let promise = new Promise(resolve => {
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

                        xhr.open('GET', this.imageBase64Data);
                        xhr.send();
                    });
                    promise.then(data => {
                        this.imageBase64Data = data;
                        this.makeScene();
                    });
                }
            }
        }
        // getPixiObj
    },
    watch: {
        imageUrl: function () {
            this.handleImageUrlChange(this.imageUrl);
        }
    }
};
let VImage = VShape.extend(component);
export function VImageFactory(opts) {
    return factoryFn(VImage, opts);
}
export default VImage;