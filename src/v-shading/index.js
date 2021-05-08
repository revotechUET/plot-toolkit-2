import VShape from "../v-shape";
import VPath from '../v-path';
import VRect from '../v-rect';
import { scaleLinear, scaleQuantile } from "d3-scale";
import pattern from '../main/pattern_sample.json';
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
import { Texture, utils } from "pixi.js";

async function draw(obj) {
    console.log("shading draw");
    this.shadingColorList = [];
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
        myPallete;
    switch (this.typeFillColor) {
        case "Gradient": //transform linear
            if (!this.minColor || !this.maxColor) {
                throw new Error(`No sufficient information for fill color
                            Gradient: min color ${this.minColor} and max color ${this.maxColor}`)
            }
            transformColor = scaleLinear().domain([this.realMinX, this.realMaxX])
                .range([this.minColor, this.maxColor]);
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
            let rangeCheck = {}
            for (let i = 0; i < this.customFillValues.length; i++) {
                let ele = this.customFillValues[i];
                if (ele["lowVal"] > 1 || ele["highVal"] > 1 || ele["lowVal"] === ele["highVal"]) {
                    throw new Error(`Invalid custom fill values with low value: ${ele["lowVal"]}
                                    and high value: ${ele["highVal"]}`);
                }
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
                        bgColors.push("transparent", formatBgColorList[i]);
                        fgColors.push("white", formatFgColorList[i]);
                        fillPatterns.push(null, formatPatternList[i]);
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

                    Object.keys(rangeCheck).forEach(key => {
                        if (rangeCheck[key] === mn) {
                            let idx = fillValues.indexOf(key);
                            if (fillValues[idx + 1] && mx > fillValues[idx + 1]) {
                                throw new Error(`Range duplicated: ${fillValues} with: ${mn} and ${mx}`);
                            } else if (mx === fillValues[idx + 1]) {
                                rangeCheck[mn] = mx;
                                bgColors.splice(idx, 0, formatBgColorList[i]);
                                fgColors.splice(idx, 0, formatFgColorList[i]);
                                fillPatterns.splice(idx, 0, formatPatternList[i]);
                            } else {
                                fillValues.splice(idx + 1, 0, mx);
                                bgColors.splice(idx, 0, formatBgColorList[i], "transparent");
                                fgColors.splice(idx, 0, formatFgColorList[i], "white");
                                fillPatterns.splice(idx, 0, formatPatternList[i], null);
                                rangeCheck[mn] = mx;
                                rangeCheck[mx] = fillValues[idx + 1];
                            }
                        }
                    })
                }
            }
            console.log("rang check", rangeCheck)
            console.log("fillValues", fillValues);
            console.log("backgroundColorList", bgColors);
            console.log("fill patterns", fillPatterns);
            console.log("foreground color", fgColors);
            transformColor = scaleQuantile().domain(fillValues).range(bgColors);
            break;
        case "Pallete":
            if (!this.pallete) {
                throw new Error(`No sufficient information for fill color Pallete: ${this.pallete}`);
            }
            myPallete = this.pallete.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`);
            transformColor = scaleQuantile().domain([this.realMinX, this.realMaxX]).range(myPallete);
            break;
        default:
            throw new Error(`No sufficient information for type fill color : ${this.typeFillColor}`);
    }

    for (let i = 0; i < this.cPolygonList.length; i++) {
        let polygon = this.cPolygonList[i], idx = i;
        let posXFillColor;
        if (polygon.length === 4) { // this polygon is quadrilateral
            posXFillColor = Math.max(polygon[0]["x"], polygon[1]["x"]);

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
        } else { // this polygon is not quadriateral => it must be triangle
            posXFillColor = Math.min(polygon[0]["x"], polygon[1]['x']);
            if (idx >= 1 && this.cPolygonList[idx - 1].length === 3 && polygon[0]["x"] < polygon[1]["x"]) {
                posXFillColor = polygon[2]["x"];
            }
            if (i === 0) {
                if (polygon[0]["x"] < polygon[1]["x"]) {
                    this.shadingPathLeft.push(polygon[0], polygon[2]);
                    this.shadingPathRight.push(polygon[1], polygon[2]);
                } else {
                    this.shadingPathLeft.push(polygon[1], polygon[2]);
                    this.shadingPathRight.push(polygon[0], polygon[2]);
                }
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
        switch (this.typeFillColor) {
            case "Gradient":
                myFillColor = processColorStr(transformColor(posXFillColor));
                this.shadingColorList.push(myFillColor.color);
                obj.beginFill(
                    myFillColor.color,
                    myFillColor.transparency
                );
                this.myDrawPolygon(obj, polygon);
                obj.endFill();
                break;
            case "Custom Fills":
                let xScale = (posXFillColor - this.realMinX) / (this.realMaxX - this.realMinX);
                let index;
                for (let j = 0; j < fillValues.length; j++) {
                    if (fillValues[j] <= xScale) {
                        index = j;
                    }
                }
                if (fillPatterns[index] && pattern[fillPatterns[index]]) {
                    let srcUrl = `https://users.i2g.cloud/pattern/${pattern[fillPatterns[index]]}_.png?service=WI_BACKEND`;
                    let myFgColor = convert2rgbColor(fgColors[index]),
                        myBgColor = convert2rgbColor(transformColor(xScale));
                    this.shadingColorList.push((processColorStr(transformColor(xScale)).color));
                    let imagePattern = await getImagePattern(srcUrl);
                    let canvas = blendColorImage(imagePattern, myFgColor, myBgColor);
                    const texture = Texture.from(canvas);
                    obj.beginTextureFill(texture);
                }
                this.myDrawPolygon(obj, polygon);
                obj.endFill();
                break;
            case "Pallete":
                myFillColor = processColorStr(transformColor(posXFillColor));
                this.shadingColorList.push(myFillColor.color);
                obj.beginFill(
                    myFillColor.color,
                    myFillColor.transparency
                );
                this.myDrawPolygon(obj, polygon);
                obj.endFill();
                break;
        }
    };

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
    let polygonArr = [];
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
            } else {
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
            } else {
                polygonArr.push([...arr[i], ...secondPath]);
            }
        }
    }
    return polygonArr;
}

function registerEvents(_pixiObj) {
    let pixiObj = _pixiObj || this.getPixiObj();
    pixiObj.interactive = true;

    const handleMouseDown = async evt => {
        this.isShading = !this.isShading;
        this.$children.length > 0 && this.$children.forEach(child => {
            child.cleanUp();
            child.makeScene();
        });
    }

    pixiObj.on("mousedown", handleMouseDown);
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
        "pallete"
    ],
    template,
    data: function () {
        return {
            isShading: false,
            shadingPathLeft: [],
            shadingPathRight: [],
            shadingColorList: [],
        }
    },
    computed: {
        cPolygonList: function () {
            let begin, end, path = [];
            let bothIsArr = Array.isArray(this.realLeft) && Array.isArray(this.realRight);
            if (bothIsArr) {
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
                    path = this.realLeft;
                    begin = { x: this.realRight, y: path[0]["y"] };
                    end = { x: this.realRight, y: path[path.length - 1]["y"] };
                } else if (!Array.isArray(this.realLeft) && Array.isArray(this.realRight)) {
                    path = this.realRight;
                    begin = { x: this.realLeft, y: path[0]["y"] };
                    end = { x: this.realLeft, y: path[path.length - 1]["y"] };
                }
                path = [begin, ...path, end];
            }
            return generatePolygons(path, bothIsArr);
        },
        componentType: function () {
            return "VShading";
        }
    },
    methods: {
        draw,
        registerEvents,
        myDrawPolygon: function (obj, polygon) {
            let res = [];
            polygon.forEach(item => {
                res.push(this._getX(item.x), this._getY(item.y));
            });
            obj.drawPolygon(res);
        }
    },
    components: {
        VRect, VPath
    }
};

export default VShape.extend(component);