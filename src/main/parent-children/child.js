const component = {
  template: 
    `<div class="Child">
      Child {{name}} {{isSelected}}
    </div>`,
  props: [
    'name'
  ],
  data: function() {
    return {
      isSelected: false
    }
  },
  mounted: function() {
    console.log(this.name + " child Mounted");
    this.$emit("ccchanged");
  }
}
export default component;

