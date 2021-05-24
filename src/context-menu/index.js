import Vue from 'vue';
import template from './template.html';
import style from './style.less';

let component = {
    props: [
        "contextType",
        "contextPosX",
        "contextPosY"
    ],
    computed: {
        contextMenu: function () {
            switch (this.contextType) {
                case "VTrack":
                    return ["Track Properties", "Add Marker", "Add Annotation",
                        "Create Shading", "Duplicate Track", "Apply to another well",
                        "Add Depth Track", "Add Log Track", "Add Image Track",
                        "Add Zone Track", "Add Object Track", "Add Rose Diagram Track",
                        "Add Tadpole Track", "Delete Track"];
                case "VShading":
                    return ["Shading Properties", "Remove Shading"];
                case "VZone":
                    return ["Zone Properties", "Remove Zone", "Split Zone"];
                case "VCurve":
                    return ["Curve Properties", "Split Curve", "Depth Shift",
                        "Baseline Shift", "Smooth Curve", "Edit Curve",
                        "Fill Curve", "Calculate INPEEA", "Remove Curve",
                        "Reverse Display", "Create Cross-Plot", "Create Histogram",
                        "Creat Shading"]
                default:
                    return [];
            }
        }
    },
    template
}

export default Vue.extend(component);
