import VObject from '../v-object';
import {getColor, DefaultColors, getTransparency} from '../utils';
function registerEvents(_pixiObj) {
    let pixiObj = _pixiObj || this.getPixiObj();
    if (this.enabled) {
        pixiObj.interactive = true;
        pixiObj.buttonMode = true;
    }
    pixiObj.on('mouseover', (evt) => {
        this.hasMouseOver = true;
        this.onmouseover && this.onmouseover(evt.currentTarget, 
            evt.currentTarget.toLocal(evt.data.global), 
            evt.data.global, evt
        );
    });
    pixiObj.on('mouseout', (evt) => {
        this.hasMouseOver = false;
        this.onmouseout && this.onmouseout(evt.currentTarget, 
            evt.currentTarget.toLocal(evt.data.global), 
            evt.data.global, evt
        );
    });
    this.onmousedown && pixiObj.on('mousedown', (evt) => {
        let currentTarget = evt.currentTarget;
        let globalPos = evt.data.global;
        this.onmousedown(currentTarget, currentTarget.toLocal(globalPos), globalPos, evt);
    });
}
function draw(obj) {
    console.log("Shape draw");
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
    obj.x = this.posX || 0;
    obj.y = this.posY || 0;
    obj.rotation = this.rotation || 0;
}
const propKeys = ['shape', 'clipped', 'enabled',
    'radius', 'path',
    'lineWidth', 'lineColor', 'lineTransparency',
    'fillColor', 'fillTransparency',
    'onmousedown'
];
let component = {
    props: propKeys,
    data: function() {
        return {
            hasMouseOver: false
        }
    },
    mounted: function () {
        this.makeScene();
        this.registerEvents();
    },
    computed: {
        compProps: function () {
            let array = [this.baseCompProps, this.hasMouseOver, (this.pixiObj||{}).zIndex];
            propKeys.forEach(k => {
                if (typeof this[k] !== 'function') array.push(this[k])
            });
            return array.join('|');
        }
    },
    methods: {
        registerEvents, draw
    }
}
export default VObject.extend(component);