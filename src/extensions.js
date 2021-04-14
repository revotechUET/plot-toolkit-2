import { Graphics } from 'pixi.js';
export default function CustomGraphics(geometry) {
    Graphics.call(this, geometry);
}
CustomGraphics.prototype = Object.create(Graphics.prototype);

CustomGraphics.prototype.drawPlus = function (x, y, symbolSize) {
    this.moveTo(x, y - symbolSize);
    this.lineTo(x, y + symbolSize);
    this.moveTo(x - symbolSize, y);
    this.lineTo(x + symbolSize, y);
};

CustomGraphics.prototype.drawLine = function (x1, y1, x2, y2, lineDashSpec) {
    if (!lineDashSpec) {
        this.moveTo(x1, y1);
        Graphics.prototype.lineTo.call(this, x2, y2);
    } else {
        let dashLeft = 0;
        let gapLeft = 0;
        let dash, gap;
        let lineDashArray = lineDashSpec;

        if (typeof lineDashSpec === "string") {
            lineDashArray = lineDashSpec
                .replace("(", "")
                .replace(")", "")
                .replace("[", "")
                .replace("]", "")
                .split(/[\s,]+/)
                .map((e) => parseInt(e))
                .filter((e) => !isNaN(e));
        }
        dash = lineDashArray[0];
        gap = lineDashArray[1];

        let dx = x2 - x1;
        let dy = y2 - y1;
        var len = Math.sqrt(dx * dx + dy * dy);
        var normal = { x: dx / len, y: dy / len };
        var progressOnLine = 0;
        this.moveTo(x1 + gapLeft * normal.x, y1 + gapLeft * normal.y);
        while (progressOnLine <= len) {
            progressOnLine += gapLeft;
            if (dashLeft > 0) progressOnLine += dashLeft;
            else progressOnLine += dash;
            if (progressOnLine > len) {
                dashLeft = progressOnLine - len;
                progressOnLine = len;
            } else {
                dashLeft = 0;
            }
            Graphics.prototype.lineTo.call(this,
                x1 + progressOnLine * normal.x,
                y1 + progressOnLine * normal.y
            );
            progressOnLine += gap;
            if (progressOnLine > len && dashLeft == 0) {
                gapLeft = progressOnLine - len;
            } else {
                gapLeft = 0;
                this.moveTo(
                    x1 + progressOnLine * normal.x,
                    y1 + progressOnLine * normal.y
                );
            }
        }
    }
};

CustomGraphics.prototype.myLineTo = function (x, y, lineDashSpec) {
    if (!lineDashSpec) {
        console.log(this.currentPath.points);
        Graphics.prototype.lineTo.call(this.x, y);
    } else {
        let start = this.currentPath.points;
        let x1 = start[0],
            y1 = start[1];
        let x2 = x,
            y2 = y;
        let dashLeft = 0;
        let gapLeft = 0;
        let dash, gap;
        let lineDashArray = lineDashSpec;

        if (typeof lineDashSpec === "string") {
            lineDashArray = lineDashSpec
                .replace("(", "")
                .replace(")", "")
                .replace("[", "")
                .replace("]", "")
                .split(/[\s,]+/)
                .map((e) => parseInt(e))
                .filter((e) => !isNaN(e));
        }
        dash = lineDashArray[0];
        gap = lineDashArray[1];

        let dx = x2 - x1;
        let dy = y2 - y1;
        var len = Math.sqrt(dx * dx + dy * dy);
        var normal = { x: dx / len, y: dy / len };
        var progressOnLine = 0;
        while (progressOnLine <= len) {
            progressOnLine += gapLeft;
            if (dashLeft > 0) progressOnLine += dashLeft;
            else progressOnLine += dash;
            if (progressOnLine > len) {
                dashLeft = progressOnLine - len;
                progressOnLine = len;
            } else {
                dashLeft = 0;
            }
            Graphics.prototype.lineTo.call(this,
                x1 + progressOnLine * normal.x,
                y1 + progressOnLine * normal.y
            );
            progressOnLine += gap;
            if (progressOnLine > len && dashLeft == 0) {
                gapLeft = progressOnLine - len;
            } else {
                gapLeft = 0;
                this.moveTo(
                    x1 + progressOnLine * normal.x,
                    y1 + progressOnLine * normal.y
                );
            }
        }
    }
};

CustomGraphics.prototype.beginFill = function (color, transparency, texture) {
    if (texture) {
        return this.beginTextureFill(texture);
    }
    Graphics.prototype.beginFill.call(this, color, transparency);
}