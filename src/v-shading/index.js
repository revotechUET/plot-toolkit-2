import VShape from "../v-shape";
import { processColorStr, getTransparency, DefaultValues, getPosX, getPosY } from "../utils";
import { scaleLinear } from "d3-scale";

async function draw(obj) {
    obj.clear();
    console.log(this.cPolygonList);

    let myFillColor;
    let transformColor = scaleLinear().domain([this.realMinX, this.realMaxX]).range([this.minColor, this.maxColor]);
    this.cPolygonList.forEach((polygon, idx) => {
        let posXFillColor;
        if (polygon.length === 4) { // this polygon is quadrilateral
            posXFillColor = polygon[0]["x"] > polygon[1]["x"] ? polygon[0]["x"] : polygon[1]["x"];
        } else { // this polygon is not quadriateral => it must be triangle
            posXFillColor = Math.min(polygon[0]["x"], polygon[1]['x']);
            if (idx >= 1 && this.cPolygonList[idx - 1].length === 3 && polygon[0]["x"] < polygon[1]["x"]) {
                posXFillColor = polygon[2]["x"];
            } else {
                posXFillColor = Math.min(polygon[0]["x"], polygon[1]['x']);
            }
        }
        console.log("pos x fill color", posXFillColor);
        myFillColor = processColorStr(transformColor(posXFillColor), DefaultValues.fillColor)
        obj.beginFill(
            myFillColor.color,
            myFillColor.transparency
        );
        // obj.drawPolygon(polygon);
        this.myDrawPolygon(obj, polygon);
        obj.endFill();
    });

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
    console.log("path", path);
    let polygonArr = [];
    if (!bothIsArr) {
        let x = path[0]["x"];
        let polygon;
        let i = 1;
        while (i < path.length - 2) {
            // polygon = [x, path[i][1], ...path.slice(i, i + 4), x, path[i + 3]];
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
            console.log(i, i + 1, arr[i], arr[i + 1]);
            let mx = Math.max(arr[i + 1][0]["x"], arr[i + 1][1]["x"]);
            let indexMx;
            arr[i + 1].forEach((item, idx) => {
                if (item.x === mx) {
                    indexMx = idx;
                }
            });
            console.log("index max", indexMx);
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

let component = {
    props: [
        "realLeft",
        "realRight",
        "minColor",
        "maxColor"
    ],
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
    },
    methods: {
        draw,
        myDrawPolygon(obj, polygon) {
            let res = [];
            polygon = polygon.forEach(item => {
                res.push(this._getX(item.x), this._getY(item.y));
            });
            obj.drawPolygon(res);
        }
    },
};

export default VShape.extend(component);