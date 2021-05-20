const component = {
  props: ['childrenChanged'],
  template: `
    <div class="Parent">
      <slot></slot>

      <button v-for="(child, idx) in $children" :key="'$childrent-'+idx" 
        @click="child.isSelected = !child.isSelected"
      >{{child.isSelected}}</button>

      {{childrenChanged}} {{nChildren}}
    </div>
  `,
  data: function() {
    return {
      nChildren: 0
    }
  },
  mounted: function() {
    this.nChildren = this.$children.length;
  },
  methods: {
    itemClick(state, idx) {
      let instance = this.$children[idx];
      instance.isSelected = !state;
    }
  },
  watch: {
    childrenChanged: function() {
      console.log('Children changed', this.childrenChanged);
      this.nChildren = this.$children.length;
    }
  }
}
export default component;
