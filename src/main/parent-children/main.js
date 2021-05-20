import Vue from 'vue';
import Parent from './parent';
import Child from './child';

let app = new Vue({
    el: "#vue-app",
    template: `<div>
      <Parent name='World' :children-changed="childCount">
        <Child v-for="(child,idx) in children" :key="'child-' + idx" :name="child" @myEvent="childChanged" />
      </Parent>
      <button @click="addChild('Brian')">Add child</button>
      <button @click="removeChild()">Remove child</button>
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
      removeChild() {
        console.log('remove child');
        this.children.pop();
      },
      childChanged() {
        console.log('received ccchanged event');
        this.childCount = this.children.length;
      }
    },
    components: {
        Parent, Child
    }
});
