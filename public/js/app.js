var vm = new Vue({
    el: '#app',
    data: {
        month: [
            [ 'Январь', 'Января' ],
            [ 'Февраль', 'Февраля' ],
            [ 'Март', 'Марта' ],
            [ 'Апрель', 'Апреля' ],
            [ 'Май', 'Мая' ],
            [ 'Июнь', 'Июня' ],
            [ 'Июль', 'Июля' ],
            [ 'Август', 'Августа' ],
            [ 'Сентябрь', 'Сентября' ],
            [ 'Октябрь', 'Октября' ],
            [ 'Ноябрь', 'Ноября' ],
            [ 'Декабрь', 'Декабря' ]
        ],
        calendar: {
            today: new Date(),
            prev: {
                year: null,
                month: null,
                day: null
            },
            current: {
                date_string: null,
                year: null,
                month: null,
                day: null,
                full_date: null
            },
            next: {
                year: null,
                month: null,
                day: null
            }
        },
        date: null,
        // date: 15,
        times: [
            '00:00', '00:30', 
            '01:00', '01:30', 
            '02:00', '02:30', 
            '03:00', '03:30', 
            '04:00', '04:30', 
            '05:00', '05:30', 
            '06:00', '06:30', 
            '07:00', '07:30', 
            '08:00', '08:30', 
            '09:00', '09:30', 
            '10:00', '10:30', 
            '11:00', '11:30', 
            '12:00', '12:30', 
            '13:00', '13:30', 
            '14:00', '14:30', 
            '15:00', '15:30', 
            '16:00', '16:30', 
            '17:00', '17:30', 
            '18:00', '18:30', 
            '19:00', '19:30', 
            '20:00', '20:30', 
            '21:00', '21:30', 
            '22:00', '22:30', 
            '23:00', '23:30', 
        ],
        time: null,
        entry: [
            {
                
            }
        ]
    },
    mounted: function () {
        this.calendar.current.date_string = new Date()
        this.calendar.current.year = new Date().getFullYear()
        this.calendar.current.month = new Date().getMonth()
        this.calendar.current.day = new Date().getDate()
        this.calendar.current.full_date = this.calendar.current.year + '-' + this.calendar.current.month + '-' + this.calendar.current.day
    },
    methods: {
        useDate: function (day) {
            // alert(this.calendar.current.day)
            // alert(day)
            Vue.set(vm, 'date', day)
        },
        setTime: function (time) {
            Vue.set(vm, 'time', time)
            $('#exampleModal').modal()
        }
    },
    watch: {

    },
    computed: {
        calendar_current_days: function () {
            if (this.calendar.current.year !== null && this.calendar.current.month !== null) {
                return new Date(this.calendar.current.year, this.calendar.current.month, 0).getDate()
            } else {
                return null
            }
        }
        // count_days_in_month: function () {
        //     return this.daysInMonth()
        // },
        // prev_year: function () {
        //     if (this.current_year && this.current_month) {
        //         var temp = new Date(this.current_year,this.current_month,1)
        //         temp.setMonth(this.current_month-1)
        //         return temp.getFullYear()
        //     } else {
        //         return null
        //     }
        // },
        // prev_month: function () {
        //     if (this.current_year && this.current_month) {
        //         var temp = new Date(this.current_year,this.current_month,1)
        //         temp.setMonth(this.current_month-1)
        //         return temp.getMonth()
        //     } else {
        //         return null
        //     }
        // },
        // next_year: function () {
        //     if (this.current_year && this.current_month) {
        //         var temp = new Date(this.current_year,this.current_month,1)
        //         temp.setMonth(this.current_month+1)
        //         return temp.getFullYear()
        //     } else {
        //         return null
        //     }
        // },
        // next_month: function () {
        //     if (this.current_year && this.current_month) {
        //         var temp = new Date(this.current_year,this.current_month,1)
        //         temp.setMonth(this.current_month+1)
        //         return temp.getMonth()
        //     } else {
        //         return null
        //     }
        // },
    }
})
