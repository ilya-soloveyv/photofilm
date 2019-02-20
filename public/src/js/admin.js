const Order = {
    template: `<div>Orders</div>`
}
const Place = {
    template: `
        <router-view></router-view>
    `
}
const PlaceList = {
    data () {
        return {
            loading: true,
            place: [],
        }
    },
    created: function () {
        _this = this
        axios.post('/admin/PlaceList')
        .then(function (response) {
            _this.place = response.data
        })
    },
    template: `
        <div id="place">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" width=50>#</th>
                        <th>Наименование</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(place, index) in place">
                        <th scope="row">
                            {{ place.iPlaceID }}
                        </th>
                        <td>
                            <router-link v-bind:to="'/place/'+place.iPlaceID">{{ place.sPlaceTitle }}</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
}
const PlaceView = {
    data () {
        return {
            loading: true,
            place: [],
        }
    },
    props: [
        'id'
    ],
    created: function () {
        var _this = this
        axios.post('/admin/PlaceView', {
            iPlaceID: this.id
        })
        .then(function (response) {
            _this.fetchData(response.data)
        })
    },
    methods: {
        fetchData (data) {
            this.loading = false
            this.place = data
        }
    },
    template: `
        <div id="place">
            <h2>{{ place.sPlaceTitle }}</h2>
            {{ place }}
        </div>
    `
}
const routes = [
    {
        path: '/order',
        component: Order
    },
    {
        path: '/place/',
        component: Place,
        children: [
            {
                path: '',
                component: PlaceList
            },
            {
                path: ':id',
                component: PlaceView,
                props: true
            }
        ]
    }
]
const router = new VueRouter({
    routes
})
const app = new Vue({
    router,
    data: {
        title: 'Booking CRM',
        menu: [
            {
                title: 'Площадки',
                uri: '/place',
                active: false
            },
            {
                title: 'Заказы',
                uri: '/order',
                active: false
            },
        ]
    }
}).$mount('#app')