(function() {
    Date.prototype.toYMD = Date_toYMD;
    function Date_toYMD() {
        var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    }
})();

var vm = new Vue({
    el: '#app',
    data: {
        current_date: new Date(),
        // current_date: new Date(2019, 0, 31),
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
        date: null,
        // date: new Date(2019, 1, 19),
        times: [
            '00:00:00',
            '01:00:00',
            '02:00:00',
            '03:00:00',
            '04:00:00',
            '05:00:00',
            '06:00:00',
            '07:00:00',
            '08:00:00',
            '09:00:00',
            '10:00:00',
            '11:00:00',
            '12:00:00',
            '13:00:00',
            '14:00:00',
            '15:00:00',
            '16:00:00',
            '17:00:00',
            '18:00:00',
            '19:00:00',
            '20:00:00',
            '21:00:00',
            '22:00:00',
            '23:00:00',
        ],
        time: null,
        entry: [
            {
                
            }
        ],
        objects: [
            {
                id: 1,
                title: 'Помещение 1'
            },
            {
                id: 2,
                title: 'Помещение 2'
            },
            {
                id: 3,
                title: 'Помещение 3'
            },
            {
                id: 4,
                title: 'Помещение 4'
            },
            {
                id: 5,
                title: 'Помещение 5'
            },
        ],
        current_object: 1,
        orderHour: [
            {
                title: "Один час",
                value: 1
            },
            {
                title: "Два часа",
                value: 2
            },
            {
                title: "Три часа",
                value: 3
            },
            {
                title: "Четыре часа",
                value: 4
            },
            {
                title: "Пять часов",
                value: 5
            },
        ],
        orderHoutSelect: 1
    },
    created: function () {

    },
    mounted: function () {

    },
    methods: {
        useDate: function (day) {
            var useDate = new Date(this.current_date.getFullYear(), this.current_date.getMonth(), day)
            Vue.set(vm, 'date', useDate)
            Vue.set(vm, 'current_date', useDate)
            this.getEntry()
        },
        setTime: function (time) {
            Vue.set(vm, 'time', time)
            // $('#exampleModal').modal()
        },
        prevMonth: function () {
            let Y = this.current_date.getFullYear()
            let M = this.current_date.getMonth()
            let temp_date = new Date(Y, M, 1)
                temp_date.setMonth(temp_date.getMonth()-1)
            Vue.set(vm, 'current_date', temp_date)
        },
        nextMonth: function () {
            let Y = this.current_date.getFullYear()
            let M = this.current_date.getMonth()
            let temp_date = new Date(Y, M, 1)
                temp_date.setMonth(temp_date.getMonth()+1)
            Vue.set(vm, 'current_date', temp_date)
        },
        prevDay: function () {
            var newDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate())
                newDate.setDate(newDate.getDate()-1)
            Vue.set(vm, 'date', newDate)
            Vue.set(vm, 'current_date', newDate)
            this.getEntry()
        },
        nextDay: function () {
            var newDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate())
                newDate.setDate(newDate.getDate()+1)
            Vue.set(vm, 'date', newDate)
            Vue.set(vm, 'current_date', newDate)
            this.getEntry()
        },
        clearDate: function () {
            Vue.set(vm, 'date', null)
            Vue.set(vm, 'time', null)
        },
        clearTime: function () {
            Vue.set(vm, 'time', null)
            this.getEntry()
        },
        getEntry: function () {
            if (vm.date && vm.current_object) {
                axios.post('/get', {
                    dEntryDate: new Date(vm.date).toYMD(),
                    iObjectID: vm.current_object
                })
                .then(function (response) {
                    // console.log(response.data)
                    Vue.set(vm, 'entry', response.data)
                    Vue.nextTick(function () {
                        $('.entry').each(function (i, v) {
                            var from = $(this).attr('data-from')
                            var to = $(this).attr('data-to')
                            console.log(from, to)
                            var top = $('.time[data-date="'+from+'"]').position().top
                            var top2 = $('.time[data-date="'+to+'"]').position().top
                            if (top2 === 0) { top2 = $('.times').height() }
                            console.log(top, top2)
                            // console.log(el)
                            $(this).css({top: top}).height(top2-top)
                        })
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })    
            }
        },
        orderTime: function () {
            axios.post('/set', {
                iObjectID: this.current_object,
                dEntryDate: this.dateString,
                tEntryTimeFrom: this.time,
                orderHoutSelect: this.orderHoutSelect
            })
            .then(function (response) {
                vm.clearTime()
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    watch: {
        current_object: function () {
            this.getEntry()
        }
    },
    computed: {
        year: function () {
            return this.current_date.getFullYear()
        },
        count_month_days: function () {
            let Y = this.current_date.getFullYear()
            console.log(Y)
            let M = this.current_date.getMonth()
            console.log(M)
            
            return 32 - new Date(Y, M, 32).getDate()
        },
        month_name: function () {
            let M = this.current_date.getMonth()
            return this.month[M][0]
        },
        currentDate: function () {
            return this.date.getDate() + ' ' + this.month[this.date.getMonth()][0] + ' ' + this.date.getFullYear()
        },
        dateString: function () {
            return new Date(vm.date).toYMD()
        }
    }
})
