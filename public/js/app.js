Vue.component('button-counter', {
    props: ['title'],
    data: function () {
        return {
            count: 0
        }
    },
    template: '<button v-on:click="count++">{{ title }} — {{ count }}</button>'
})

var vm = new Vue({
    el: '#app',
    data: {
        title: 'loading...',
        title2: 'Счетчик:'
    }
})

