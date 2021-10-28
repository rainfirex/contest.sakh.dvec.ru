<template>
    <div class="IntervalFilter">
        <div class="row">
            <div class="m-4">
                <h3 class="text-center">Интервал</h3>
            </div>
        </div>
        <div class="row">
            <div class="offset-3 col-3">
                <input class="form-control" type="date" v-model="dateStart">
            </div>
            <div class="col-3">
                <input class="form-control" type="date" v-model="dateEnd">
            </div>
        </div>

        <div class="text-center m-4">
            <button class="btn btn-secondary" @click="$store.dispatch('getTestInterval', {dateStart, dateEnd})">Выбрать данные</button>
        </div>

        <table class="table table-striped">
            <tr class="text-center column-header">
                <th scope="col" @click="sortId">
                    <span v-if="typeSortId">↓</span>
                    <span v-else>↑</span>
                    №</th>
                <th scope="col" @click="sortResultTest">
                    <span v-if="typeSortTest">↓</span>
                    <span v-else>↑</span>
                    Тест
                </th>
                <th scope="col" @click="sortResultName">
                    <span v-if="typeSortName">↓</span>
                    <span v-else>↑</span>
                    ФИО
                </th>
                <th scope="col" @click="sortResultAnswers">
                    <span v-if="typeSortAnswers">↓</span>
                    <span v-else>↑</span>
                    Ответов
                </th>
                <th scope="col" @click="sortResultTimeInterval">
                    <span v-if="typeSortTimer">↓</span>
                    <span v-else>↑</span>
                    Время
                </th>
            </tr>
            <tr v-for="(result, index) in tests">
                <td><b>{{ index + 1 }})</b></td>
                <td>{{ result.jsonTest.title }}</td>
                <td>{{ result.user.name }}</td>
                <td class="text-center">{{ result.result.success }} / {{result.result.fails + result.result.success}}
                </td>
                <td class="text-center">{{ result.result.timeInterval }}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        computed: {
            tests(){
                // return this.$store.getters.getTestInterval.sort((a, b) => parseInt(a.result.success) > parseInt(b.result.success) );
                return this.$store.getters.getTestInterval.sort((item1, item2) => {
                    return item1.id > item2.id;
                });
            }
        },
        data() {
            return {
                dateStart: null,
                dateEnd: null,
                typeSortId: false,
                typeSortTest: false,
                typeSortName: false,
                typeSortAnswers: false,
                typeSortTimer: false
            }
        },
        methods: {
            sortId(){
                this.tests.sort((a, b) => {
                    if(this.typeSortId)
                        return b.id - a.id;
                    else
                        return a.id - b.id;
                });
                this.typeSortId = !this.typeSortId;
            },
            sortResultTest(){
                this.tests.sort( (a, b) => {
                    if(this.typeSortTest){
                        if(a.jsonTest.title < b.jsonTest.title) return -1;
                        if(a.jsonTest.title > b.jsonTest.title) return 1;
                        return 0;
                    }
                    else
                    {
                        if(a.jsonTest.title > b.jsonTest.title) return -1;
                        if(a.jsonTest.title < b.jsonTest.title) return 1;
                        return 0;
                    }
                });
                this.typeSortTest = !this.typeSortTest;
            },
            sortResultName(){
                this.tests.sort((a,b) => {

                    if (this.typeSortName){
                        if(a.user.name < b.user.name) return -1;
                        if(a.user.name > b.user.name) return 1;
                        return 0;
                    } else
                    {
                        if(a.user.name > b.user.name) return -1;
                        if(a.user.name < b.user.name) return 1;
                        return 0;
                    }
                });
                this.typeSortName = !this.typeSortName;
            },
            sortResultAnswers(){
                this.tests.sort((a, b) => {
                    if(this.typeSortAnswers)
                        return a.result.success - b.result.success;
                    else
                        return b.result.success - a.result.success;
                });
                this.typeSortAnswers = !this.typeSortAnswers;
            },
            sortResultTimeInterval(){
                this.tests.sort((a, b) => {
                    const date = a.result.date.split('.');
                    const t1 = a.result.timeInterval.split(':');
                    const d1 = new Date(date[2], date[1]-1, date[0], t1[0], t1[1], t1[2]);
                    const t2 = b.result.timeInterval.split(':');
                    const d2 = new Date(date[2], date[1]-1, date[0], t2[0], t2[1], t2[2]);

                    if (this.typeSortTimer)
                        return d1 - d2;
                    else
                        return d2 - d1;
                });
                this.typeSortTimer = !this.typeSortTimer;
            },
            formatDate(date) {
                const d = date.split('T')[0];
                const dte = new Date(d);
                return this.addZero(dte.getDate()) + '.' + this.addZero(dte.getMonth()) + '.' + dte.getFullYear();
            },
            addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
        }
    };
</script>
<style lang="scss" scoped>
    table {
        background-color: #f9f9f9;
        tr{
            &.column-header{
                cursor: pointer;
                user-select: none;
            }
            th{
                transition: 1s;
                &:hover {
                    background: #9fa6b3;
                }
            }
        }
        td{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 350px;
            border: solid 1px #e9e9e6;
            padding: 5px;
        }
    }
</style>
