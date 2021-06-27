import VShape from "../v-shape";
import VPath from '../v-path';
import VRect from '../v-rect';
import { scaleLinear, scaleQuantile } from "d3-scale";
import {
    processColorStr,
    DefaultValues,
    getImagePattern,
    convert2rgbColor,
    blendColorImage,
    getPosX,
    getPosY
} from "../utils";
import template from './template.html';
import selectable from '../mixins/selectable';
import { Texture, utils } from "pixi.js";

async function draw(obj) {
    console.log("isShading draw");
    obj.clear();
    let fillValues = [],
        bgColors = [],
        fillPatterns = [],
        fgColors = [],
        mn, mx,
        myFillColor,
        transformColor,
        positiveTransformColor,
        negativeTransformColor,
        myPalette;
    let normalFillDomain = [
        (!isNaN(this.realMinX) ? this.realMinX : this.$parent.realMinX),
        (!isNaN(this.realMaxX) ? this.realMaxX : this.$parent.realMaxX)
    ]
    if (!isNaN(this.shadingLowValue) && !isNaN(this.shadingHighValue)) {
        normalFillDomain = [this.shadingLowValue, this.shadingHighValue]
    }
    switch (this.typeFillColor) {
        case "Gradient": //transform linear
            if (!this.isNormalFill) {
                if (!this.positiveSideColor || !this.negativeSideColor) {
                    throw new Error(`No sufficient information for Gradient positive/negative fill color`);
                }
                let subtractRealX = (this.realMaxX || this.$parent.realMaxX) - (this.realMinX || this.$parent.realMinX);
                let ratioPosRealX = subtractRealX / (this.shadingPositiveHighValue - this.shadingPositiveLowValue),
                    ratioNegRealX = subtractRealX / (this.shadingNegativeHighValue - this.shadingNegativeLowValue);
                console.log(ratioPosRealX, ratioNegRealX);
                positiveTransformColor = scaleLinear()
                    .domain([
                        this.shadingPositiveLowValue, this.shadingPositiveHighValue
                    ])
                    .range([this.positiveSideColor.minColor, this.positiveSideColor.maxColor]);
                negativeTransformColor = scaleLinear()
                    .domain([
                        this.shadingNegativeLowValue, this.shadingNegativeHighValue
                    ])
                    .range([this.negativeSideColor.minColor, this.negativeSideColor.maxColor]);
            } else {
                if (!this.minColor || !this.maxColor) {
                    throw new Error(`No sufficient information for fill color
                                Gradient: min color ${this.minColor} and max color ${this.maxColor}`)
                }
                transformColor = scaleLinear()
                    .domain(normalFillDomain)
                    .range([this.minColor, this.maxColor]);
            }
            break;
        case "Custom Fills": //transform discrete
            if (!this.customFillValues) {
                throw new Error(`No sufficient information for custom fill color`)
            }
            if (!this.isNormalFill) return;
            //background color list 
            let formatBgColorList = [];
            if (this.backgroundColorList) {
                formatBgColorList.push(...this.backgroundColorList);
                for (let i = this.backgroundColorList.length; i < this.customFillValues.length; i++) {
                    formatBgColorList.push("transparent");
                }
            } else {
                for (let i = 0; i < this.backgroundColorList.length; i++) {
                    formatBgColorList.push("transparent")
                }
            }
            //foreground color list
            let formatFgColorList = [];
            if (this.foregroundColorList) {
                formatFgColorList.push(...this.foregroundColorList);
                for (let i = this.foregroundColorList.length; i < this.customFillValues.length; i++) {
                    formatFgColorList.push("white");
                }
            } else {
                for (let i = 0; i < this.customFillValues.length; i++) {
                    formatFgColorList.push("white");
                }
            }
            //pattern fill list
            let formatPatternList = [];
            if (this.fillPatternList) {
                formatPatternList.push(...this.fillPatternList);
                for (let i = this.fillPatternList.length; i < this.customFillValues.length; i++) {
                    formatPatternList.push(null);
                }
            } else {
                for (let i = 0; i < this.customFillValues.length; i++) {
                    formatPatternList.push(null);
                }
            }
            let rangeCheck = {};
            for (let i = 0; i < this.customFillValues.length; i++) {
                let ele = this.customFillValues[i];
                mn = Math.min(ele["lowVal"], ele["highVal"]);
                mx = Math.max(ele["lowVal"], ele["highVal"]);
                if (fillValues.length === 0) {
                    fillValues.push(mn, mx);
                    rangeCheck[mn] = mx;
                    bgColors.push(formatBgColorList[0]);
                    fgColors.push(formatFgColorList[0]);
                    fillPatterns.push(formatPatternList[0]);
                } else {
                    if (mn > fillValues[fillValues.length - 1]) { //case: lowVal > maximum of fillValues => push both lowVal and highVal
                        rangeCheck[mn] = mx;
                        fillValues.push(mn, mx);
                        bgColors.push(formatBgColorList[i]);
                        fgColors.push(formatFgColorList[i]);
                        fillPatterns.push(formatPatternList[i]);
                        continue;
                    } else if (mn === fillValues[fillValues.length - 1]) { //case: lowVal = maximum of fillValues => just push highVal
                        rangeCheck[fillValues[fillValues.length - 1]] = mx;
                        fillValues.push(mx);
                        bgColors.push(formatBgColorList[i]);
                        fgColors.push(formatFgColorList[i]);
                        fillPatterns.push(formatPatternList[i]);
                        continue;
                    }

                    if (mx < fillValues[0]) { //case: highVal < minimum of fillValues => unshift both lowVal and highVal
                        rangeCheck[mn] = mx;
                        fillValues.unshift(mn, mx);
                        bgColors.unshift(formatBgColorList[i], "transparent");
                        fgColors.unshift(formatFgColorList[i], "white");
                        fillPatterns.unshift(formatPatternList[i], null);
                        continue;
                    } else if (mx === fillValues[0]) { //case: highVal = minimum of fillValues => just unshift lowVal
                        rangeCheck[mn] = mx;
                        fillValues.unshift(mn);
                        bgColors.unshift(formatBgColorList[i]);
                        fgColors.unshift(formatFgColorList[i]);
                        fillPatterns.unshift(formatPatternList[i]);
                        continue;
                    }

                    let flag = false;
                    for (let j = 0; j < fillValues.length; j++) {
                        if (fillValues[j] === mn) {
                            flag = true;
                        }
                    }
                    if (rangeCheck[mn] || !flag) {
                        throw new Error(`Range duplicated: ${fillValues} with: ${mn} and ${mx}`);
                    }

                    let idx = fillValues.indexOf(mn);
                    if (fillValues[idx] + 1) {
                        if (mx > fillValues[idx + 1]) {
                            throw new Error(`Range duplicated: ${fillValues} with: ${mn} and ${mx}`);
                        } else if (mx === fillValues[idx + 1]) {
                            rangeCheck[mn] = mx;
                            bgColors.splice(idx, 0, formatBgColorList[i]);
                            fgColors.splice(idx, 0, formatFgColorList[i]);
                            fillPatterns.splice(idx, 0, formatPatternList[i]);
                        }
                    }
                }
            }
            fillPatterns = fillPatterns.map((item, idx) => {
                return {
                    src: fillPatterns[idx],
                    texture: null
                }
            })
            console.log("rang check", rangeCheck)
            console.log("fillValues", fillValues);
            console.log("backgroundColorList", bgColors);
            console.log("fill patterns", fillPatterns);
            console.log("foreground color", fgColors);
            transformColor = scaleQuantile().domain(fillValues).range(bgColors);
            break;
        case "Palette":
            if (!this.isNormalFill) {
                if (!this.positiveSidePalette || !this.negativeSidePalette) {
                    throw new Error(`No sufficient information for Palette positive/negative fill color`);
                }
                positiveTransformColor = scaleQuantile()
                    .domain([
                        this.shadingPositiveLowValue, this.shadingPositiveHighValue
                    ])
                    .range(this.positiveSidePalette.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`));
                negativeTransformColor = scaleQuantile()
                    .domain([
                        this.shadingNegativeLowValue, this.shadingNegativeHighValue
                    ])
                    .range(this.negativeSidePalette.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`));
            } else {
                if (!this.palette) {
                    throw new Error(`No sufficient information for fill color Palette: ${this.palette}`);
                }
                myPalette = this.palette.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`);
                transformColor = scaleQuantile()
                    .domain(normalFillDomain)
                    .range(myPalette);
            }
            break;
        default:
            throw new Error(`No sufficient information for type fill color : ${this.typeFillColor}`);
    }

    for (let i = 0; i < this.cPolygonList.length; i++) {
        let polygon = this.cPolygonList[i], idx = i;
        let posXFillColor;
        if (polygon.length === 4) { // this polygon is quadrilateral
            posXFillColor = Math.max(polygon[0]["x"], polygon[1]["x"]);
            if (this.notIsArray) {
                switch (this.notIsArray) {
                    case "Real Right":
                        if (this.realRight >= posXFillColor) {
                            posXFillColor = Math.min(polygon[0]["x"], polygon[1]["x"]);
                        }
                        break;
                    case "Real Left":
                        if (this.realLeft >= posXFillColor) {
                            posXFillColor = Math.min(polygon[0]["x"], polygon[1]["x"]);
                        }
                }
            }
        } else { // this polygon is not quadriateral => it must be triangle
            posXFillColor = Math.min(polygon[0]["x"], polygon[1]['x']);
            if (idx >= 1 && this.cPolygonList[idx - 1].length === 3 && polygon[0]["x"] < polygon[1]["x"]) {
                posXFillColor = polygon[2]["x"];
            }
        }
        if (!this.isNormalFill) {
            let polygonMaxX = Math.max(...polygon.map(point => point["x"]));
            if (posXFillColor > this.realLeft || (posXFillColor === this.realLeft && polygonMaxX > this.realLeft)) {
                myFillColor = processColorStr(positiveTransformColor(posXFillColor));
            } else {
                myFillColor = processColorStr(negativeTransformColor(posXFillColor));
            }
        }
        switch (this.typeFillColor) {
            case "Gradient":
                if (posXFillColor) {
                    if (this.isNormalFill) {
                        myFillColor = processColorStr(transformColor(posXFillColor));
                    }
                    obj.beginFill(
                        myFillColor.color,
                        myFillColor.transparency
                    );
                    this.myDrawPolygon(obj, polygon);
                    obj.endFill();
                }
                break;
            case "Custom Fills":
                if (posXFillColor) {
                    let index;
                    for (let j = 0; j < fillValues.length; j++) {
                        if (fillValues[j] <= posXFillColor) {
                            index = j;
                        }
                    }
                    if (index === fillValues.length - 1 && fillPatterns[index - 1].texture) {
                        obj.beginTextureFill(fillPatterns[index - 1].texture)
                    } else if (fillPatterns[index] && fillPatterns[index].src) {
                        if (!fillPatterns[index].texture) {
                            let srcUrl = `https://users.i2g.cloud${fillPatterns[index].src}?service=WI_BACKEND`;
                            let myFgColor = convert2rgbColor(fgColors[index]),
                                myBgColor = convert2rgbColor(bgColors[index]);
                            let imagePattern = await getImagePattern(srcUrl);
                            let canvas = blendColorImage(imagePattern, myFgColor, myBgColor);
                            const texture = Texture.from(canvas);
                            obj.beginTextureFill(texture);
                            fillPatterns[index].texture = texture;
                        } else {
                            obj.beginTextureFill(fillPatterns[index].texture);
                        }
                    } else {
                        myFillColor = processColorStr(transformColor(posXFillColor));
                        obj.beginFill(
                            myFillColor.color,
                            myFillColor.transparency
                        );
                    }
                    this.myDrawPolygon(obj, polygon);
                    obj.endFill();
                }
                break;
            case "Palette":
                if (posXFillColor) {
                    if (this.isNormalFill) {
                        myFillColor = processColorStr(transformColor(posXFillColor));
                    }
                    obj.beginFill(
                        myFillColor.color,
                        myFillColor.transparency
                    );
                    this.myDrawPolygon(obj, polygon);
                    obj.endFill();
                }
                break;
        }
    };

    this.shadingPathLeft = [];
    this.shadingPathRight = [];
    for (let i = 0; i < this.cPolygonList.length; i++) {
        let polygon = this.cPolygonList[i];
        if (polygon.length === 4) {
            if (i === 0) {
                if (polygon[0]["x"] > polygon[1]["x"]) {
                    this.shadingPathLeft.push(polygon[1], polygon[2]);
                    this.shadingPathRight.push(polygon[0], polygon[3]);
                } else {
                    this.shadingPathLeft.push(polygon[0], polygon[3]);
                    this.shadingPathRight.push(polygon[1], polygon[2]);
                }
            } else {
                if (polygon[2]["x"] < polygon[3]["x"]) {
                    this.shadingPathLeft.push(polygon[2]);
                    this.shadingPathRight.push(polygon[3]);
                } else {
                    this.shadingPathLeft.push(polygon[3]);
                    this.shadingPathRight.push(polygon[2]);
                }
            }
        } else {
            if (i === 0) {
                if (polygon[0]["x"] < polygon[1]["x"]) {
                    this.shadingPathLeft.push(polygon[0], polygon[2]);
                    this.shadingPathRight.push(polygon[1], polygon[2]);
                } else {
                    this.shadingPathLeft.push(polygon[1], polygon[2]);
                    this.shadingPathRight.push(polygon[0], polygon[2]);
                }
            } else {
                if (this.checkTriangle[i]) {
                    this.shadingPathLeft.push(polygon[2]);
                    this.shadingPathRight.push(polygon[2]);
                } else {
                    if (polygon[0]["x"] < polygon[1]["x"]) {
                        this.shadingPathLeft.push(polygon[0]);
                        this.shadingPathRight.push(polygon[1]);
                    } else {
                        this.shadingPathLeft.push(polygon[1]);
                        this.shadingPathRight.push(polygon[0]);
                    }
                }
            }
        }
    }

    obj.x = getPosX(this.coordinate, this.posX);
    obj.y = getPosY(this.coordinate, this.posY);
    obj.rotation = this.rotation || 0;
}

function getLinearLine(point1, point2, num = 0) {
    let res = {};
    let a = (point1["y"] - point2['y']) / (point1["x"] - point2["x"]);
    let b = point1["y"] - a * point1["x"];
    num ? res[`a${num}`] = a : res['a'] = a;
    num ? res[`b${num}`] = b : res['b'] = b;
    return res;
}

function generatePolygons(path, bothIsArr) {
    let polygonArr = [], checkArr = [];
    if (!bothIsArr) {
        let x = path[0]["x"];
        let polygon;
        let i = 1;
        while (i < path.length - 2) {
            polygon = [{ x, y: path[i]["y"] }, ...path.slice(i, i + 2), { x, y: path[i + 1]["y"] }];
            if ((polygon[1]["x"] >= x && polygon[2]["x"] < x) || (polygon[1]["x"] <= x && polygon[2]["x"] > x)) {
                let { a, b } = getLinearLine(polygon[1], polygon[2]);
                polygonArr.push([...polygon.slice(0, 2), { x, y: a * x + b }]);
                polygonArr.push([...polygon.slice(2, 4), { x, y: a * x + b }]);
                checkArr.push(true, false);
            } else {
                checkArr.push(false);
                polygonArr.push(polygon);
            }
            i += 1;
        }
    } else {
        let arr = [];
        for (let i = 0; i < path.length; i += 2) {
            arr.push(path.slice(i, i + 2));
        }
        for (let i = 0; i < arr.length - 1; i++) {
            let mx = Math.max(arr[i + 1][0]["x"], arr[i + 1][1]["x"]);
            let indexMx;
            arr[i + 1].forEach((item, idx) => {
                if (item.x === mx) {
                    indexMx = idx;
                }
            });

            let x, y;
            let secondPath = [];
            if (arr[i][0]["x"] < arr[i][1]["x"]) {
                if (indexMx === 0) {
                    let { a1, b1 } = getLinearLine(arr[i][1], arr[i + 1][1], 1);
                    let { a2, b2 } = getLinearLine(arr[i][0], arr[i + 1][0], 2);
                    x = (b2 - b1) / (a1 - a2);
                    y = a1 * x + b1;
                } else {
                    secondPath.push(arr[i + 1][1], arr[i + 1][0]);
                }
            } else {
                if (indexMx === 1) {
                    let { a1, b1 } = getLinearLine(arr[i][1], arr[i + 1][1], 1);
                    let { a2, b2 } = getLinearLine(arr[i][0], arr[i + 1][0], 2);
                    x = (b2 - b1) / (a1 - a2);
                    y = a1 * x + b1;
                } else {
                    secondPath.push(arr[i + 1][1], arr[i + 1][0]);
                }
            }
            if (x && y) {
                polygonArr.push([...arr[i], { x, y }]);
                polygonArr.push([...arr[i + 1], { x, y }]);
                checkArr.push(true, false);
            } else {
                polygonArr.push([...arr[i], ...secondPath]);
                checkArr.push(false);
            }
        }
    }
    return {
        arr: polygonArr,
        checkArr
    };
}

let component = {
    props: {
        realLeft: [Number, Array],
        realRight: [Number, Array],
        shadingControlCurve: Array,
        minColor: [Number, String, Array],
        maxColor: [Number, String, Array],
        typeFillColor: String,
        customFillValues: Array,
        foregroundColorList: Array,
        backgroundColorList: Array,
        fillPatternList: Array,
        palette: Array,
        shadingLowValue: Number,
        shadingHighValue: Number,
        shadingPositiveLowValue: Number,
        shadingPositiveHighValue: Number,
        shadingNegativeLowValue: Number,
        shadingNegativeHighValue: Number,
        isNormalFill: {
            type: Boolean,
            default: true
        },
        positiveSideColor: Object,
        negativeSideColor: Object,
        positiveSidePalette: Array,
        negativeSidePalette: Array
    },
    template,
    data: function () {
        return {
            shadingPathLeft: [],
            shadingPathRight: [],
            checkTriangle: [],
            notIsArray: '',
        }
    },
    computed: {
        cPolygonList: function () {
            let begin, end, path = [];
            let bothIsArray = Array.isArray(this.realLeft) && Array.isArray(this.realRight);
            if (bothIsArray) {
                for (let i = 0; i < this.realLeft.length; i++) {
                    path.push({ x: this.realLeft[i]["x"], y: this.realLeft[i]["y"] });
                    path.push({ x: this.realRight[i]["x"], y: this.realRight[i]['y'] });
                }
            }
            else {
                if (Array.isArray(this.realLeft) && !Array.isArray(this.realRight)) {
                    this.notIsArray = "Real Right";
                    path = this.realLeft;
                    begin = { x: this.realRight, y: path[0]["y"] };
                    end = { x: this.realRight, y: path[path.length - 1]["y"] };
                } else if (!Array.isArray(this.realLeft) && Array.isArray(this.realRight)) {
                    this.notIsArray = "Real Left";
                    path = this.realRight;
                    begin = { x: this.realLeft, y: path[0]["y"] };
                    end = { x: this.realLeft, y: path[path.length - 1]["y"] };
                }
                path = [begin, ...path, end];
            }
            let { arr, checkArr } = generatePolygons(path, bothIsArray);
            this.checkTriangle = checkArr;
            return arr;
        },
        getShadingMinColor: function () {
            if (this.minColor) {
                return this.minColor;
            }
            if (this.positiveSideColor) {
                return this.positiveSideColor.minColor;
            }
        },
        getShadingMaxColor: function () {
            if (this.maxColor) {
                return this.maxColor;
            }
            if (this.positiveSideColor) {
                return this.positiveSideColor.maxColor;
            }
        },
        componentType: function () {
            return "VShading";
        },
    },
    methods: {
        draw,
        myDrawPolygon: function (obj, polygon) {
            let res = [];
            if (this.getTransformX() && this.getTransformY()) {
                polygon.forEach(item => {
                    res.push(this.transformX(item.x), this.transformY(item.y));
                })
            } else {
                polygon.forEach(item => {
                    res.push(this._getX(item.x), this._getY(item.y));
                });
            }
            obj.drawPolygon(res);
        }
    },
    components: {
        VRect, VPath
    },
    mixins: [selectable]
};

export default VShape.extend(component);