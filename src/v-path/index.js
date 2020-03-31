import vObject from '../v-object';
function getMaskObj() {
    return null;
}
function makeScene() {
    let pixiObj = this.getPixiObj();
    let pathObj = this.getPathObj();
    let pathMask = this.getPathMask();
    this.draw(pathObj);
    this.drawSymbols(pathObj);
    this.drawMask(pathMask);
}
function draw(obj) {

}
function drawSymbols(obj) {

}
function drawMask(obj) {

}
let component = {
    template: require('./template.html'),
    props:['path', 'symbol', 'symbolSize'],
    mounted: function() {
        this.makeScene();
        this.registerEvents();
    },
    methods: {
        makeScene, draw, drawMask, drawSymbols, getMaskObj 
    }
}

export default vObject.extend(component);