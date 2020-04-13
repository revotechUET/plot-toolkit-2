export default {
    props: ['layoutType', "layoutDirection"],
    methods: {
        relayout: function(comp) {
            console.log(comp);
            let idx = this.$children.filter(child => child.constrained).findIndex(child => comp === child);
            if (idx < 0) return;
            for (let i = idx + 1; i < this.$children.length; i++) {
                this.$children[i].makeScene();
            }
        },
        getChildX: function(component) {
            let x = 0;
            let idx = this.$children.filter(child => child.constrained).findIndex(child => component === child);
            if (idx < 0) return;
            switch(this.layoutDirection) {
                case "horizontal":
                    for (let i = 0; i < idx; i++) {
                        x += this.$children[i].width;
                    }
                    return x
                case "vertical":
                    return 0;
            }
        },
        getChildY: function(component) {
            let y = 0;
            let idx = this.$children.filter(child => child.constrained).findIndex(child => component === child);
            if (idx < 0) return;
            switch(this.layoutDirection) {
                case "vertical":
                    for (let i = 0; i < idx; i++) {
                        y += this.$children[i].height;
                    }
                    return y
                case "horizontal":
                    return 0;
            }
        }
    }
}