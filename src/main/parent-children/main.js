import Vue from 'vue';
import Parent from './parent';
import Child from './child';

let app = new Vue({
    el: "#vue-app",
    template: `<div>
      <Parent name='World' v-on:ccchanged="childAdded()" :children-changed="childCount">
        <Child v-for="(child,idx) in children" :key="'child-' + idx" :name="child" />
      </Parent>
      <button @click="addChild('Brian')">Add child</button>
    </div>
    `,
    data: {
      children: ['Alice', 'Bob', "Max"],
      childCount: 3
    },
    methods: {
      addChild(aChild) {
        this.children.push(aChild);
      },
      childAdded() {
        console.log('received ccchanged event');
        this.childCount = this.children.length;
      }
    },
    components: {
        Parent, Child
    }
});
