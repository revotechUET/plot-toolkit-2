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
    this.shadingPathLeft = [];
    this.shadingPathRight = [];
    obj.clear();
    let fillValues = [],
        bgColors = [],
        fillPatterns = [],
        fgColors = [],
        mn, mx,
        myFillColor,
        transformColor,
        myPalette;
    switch (this.typeFillColor) {
        case "Gradient": //transform linear
            if (!this.minColor || !this.maxColor) {
                throw new Error(`No sufficient information for fill color
                            Gradient: min color ${this.minColor} and max color ${this.maxColor}`)
            }
            if ((this.realMinX || this.realMinX === 0) && this.realMaxX) {
                transformColor = scaleLinear().domain([this.realMinX, this.realMaxX])
                    .range([this.minColor, this.maxColor])
            } else {
                transformColor = scaleLinear().domain([this.$parent.realMinX, this.$parent.realMaxX])
                    .range([this.minColor, this.maxColor]);
            };
            break;
        case "Custom Fills": //transform discrete
            if (!this.customFillValues) {
                throw new Error(`No sufficient information for custom fill color`)
            }
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
                    for (let i = 0; i < fillValues.length; i++) {
                        if (fillValues[i] === mn) {
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
            console.log("rang check", rangeCheck)
            console.log("fillValues", fillValues);
            console.log("backgroundColorList", bgColors);
            console.log("fill patterns", fillPatterns);
            console.log("foreground color", fgColors);
            transformColor = scaleQuantile().domain(fillValues).range(bgColors);
            break;
        case "Palette":
            if (!this.palette) {
                throw new Error(`No sufficient information for fill color Palette: ${this.palette}`);
            }
            myPalette = this.palette.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`);
            if (this.realMinX && this.realMaxX) {
                transformColor = scaleQuantile().domain([this.realMinX, this.realMaxX]).range(myPalette);
            } else {
                transformColor = scaleQuantile().domain([this.$parent.realMinX, this.$parent.realMaxX]).range(myPalette);
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
        switch (this.typeFillColor) {
            case "Gradient":
                if (posXFillColor) {
                    myFillColor = processColorStr(transformColor(posXFillColor));
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
                    if (fillPatterns[index]) {
                        let srcUrl = `https://users.i2g.cloud${fillPatterns[index]}?service=WI_BACKEND`;
                        let myFgColor = convert2rgbColor(fgColors[index]),
                            myBgColor = convert2rgbColor(transformColor(posXFillColor));
                        let imagePattern = await getImagePattern(srcUrl);
                        let canvas = blendColorImage(imagePattern, myFgColor, myBgColor);
                        const texture = Texture.from(canvas);
                        obj.beginTextureFill(texture);
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
                    myFillColor = processColorStr(transformColor(posXFillColor));
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
    props: [
        "realLeft",
        "realRight",
        "minColor",
        "maxColor",
        "typeFillColor",
        "customFillValues",
        "foregroundColorList",
        "backgroundColorList",
        "fillPatternList",
        "palette",
        "curveLowValue",
        "curveHighValue"
    ],
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
                let pathLeft = this.realLeft;
                let pathRight = this.realRight;
                let i = 0, j = 0;
                while (i < pathLeft.length && j < pathRight.length) {
                    path.push({ x: pathLeft[i]["x"], y: pathLeft[i]["y"] });
                    path.push({ x: pathRight[j]["x"], y: pathRight[j]["y"] });
                    i += 1;
                    j += 1;
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