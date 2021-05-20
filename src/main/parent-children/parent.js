const component = {
  props: ['childrenChanged'],
  template: `
    <div class="Parent">
      <slot></slot>

      <button v-for="idx in [...Array(nChildren).keys()]" :key="'$children-'+idx" 
        @click="$children[idx].isSelected = !$children[idx].isSelected"
      >{{$children[idx].isSelected}}</button>
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
