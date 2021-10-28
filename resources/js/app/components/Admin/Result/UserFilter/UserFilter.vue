<template>
    <div class="UserFilter">
        <div class="container">
            <div class="form-group">
                <label for="">Поиск пользователя</label>
                <input class="form-control" type="search" placeholder="имя пользователя..." v-model="textSearch" >
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label for="">Пользователи прошедшие тестирование</label>
                        <select class="form-control" size="8" v-model="userId" @change="selectUser($event)">
                            <option :value="result.user_id" v-for="(result, index) in users" :key="index">{{
                                result.user.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-6">
                    <label for="">Пройденные тесты</label>
                    <select class="form-control" size="8" v-model="testId" @change="selectTest($event)">
                        <option :value="result.test.id" v-for="(result, index) in tests" :key="index">{{
                            result.test.title }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="offset-2 col-8 mt-4 mb-1" v-if="results.length > 0">
            <div class="text-center">
                <label for="">Выберите тест</label>
                <select class="form-control" v-model="resultId" @change="selectResult">
                    <option :value="r.id"  v-for="(r, index) in results" :key="index">{{ r.jsonTest.created_at}} ({{ r.jsonTest.title }})</option>
                </select>
            </div>
            <!-- Основная инфа о тесте -->
            <div class="mt-3 mb-3 p-2 bg-light" v-if="shortResult">
                <div>
                    <p class="mb-0">
                        <b class="question-success-y" v-if="shortResult.result">Тест пройден </b>
                        <b class="question-success-n" v-if="shortResult.stoped">Тест прерван </b>
                        <b class="question-success-n" v-if="shortResult.timeout">Вышло время </b>
                        ({{ shortResult.date }})
                    </p>
                </div>
                <p class="mb-0">
                    Правильно отвеченых вопросов: <span class="question-success-y"><b>{{ shortResult.success }}</b></span>
                    Неверно отвеченых: <span class="question-success-n"><b>{{ shortResult.fails }}</b></span>
                </p>
                <p class="mb-0">Приступил к тесту: <b>{{ shortResult.timeStart }}</b>, завершил в: <b>{{ shortResult.timeStop }}</b></p>
                <p class="mb-0">Пройден за: <b>{{ shortResult.timeInterval }}</b></p>
            </div>
            <div class="text-center mt-2">
                <button class="btn btn-secondary" @click="showResult()" :disabled="resultId == null">Отобразить подробно</button>
            </div>
        </div>
        <!-- Подробно о тесте-->
        <div v-if="fullResult">
            <hr>
            <ul class="list" >
                <li v-for="question in fullResult.questions">
                    <span :class="{'question-success-y': question.success, 'question-success-n': !question.success}"><b>"{{ question.title }}"</b></span>
                    <span v-if="question.success"> - Правильный ответ</span>
                    <span v-else> - Неверный ответ</span>
                    <ul>
                        <li v-for="answer in question.answer">{{ answer.title }}
                            <span v-if="answer.checked"> - Ответ пользователя</span>
                            <span v-else> - Без ответа</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            users() {
                return this.$store.getters.getTestUsers.filter(item => item.user.name.toLowerCase()
                    .indexOf(this.textSearch.toLowerCase()) !== -1)
                    .sort((a, b) => {
                        if(a.user.name < b.user.name) return -1
                        return 0;
                    });
            },
            tests() {
                return this.$store.getters.getCurrentTests;
            },
            results(){
                return this.$store.getters.getTestResults;
            }
        },
        data(){
            return {
                userId: null,
                testId: null,
                resultId: null,
                selectUserResult: null,
                fullResult: null,
                shortResult: null,
                textSearch: ""
            }
        },
        methods: {
            selectUser(event) {
                this.resultId = null;
                this.testId = null;
                this.shortResult = null;
                this.fullResult = null;
                const userId = event.target.value;
                this.$store.dispatch('setCurrentUserById', userId);
            },
            selectTest(event) {
                this.resultId = null;
                this.shortResult = null;
                this.fullResult = null;
                const testId = event.target.value;
                this.$store.dispatch('setCurrentTestById', testId);

            },
            selectResult(){
                this.shortResult = null;
                this.fullResult = null;
                this.selectUserResult = this.results.find(item => item.id === this.resultId);
                this.shortResult = this.selectUserResult.result;
            },
            showResult(){
                if (this.resultId == null){
                    return;
                }
                this.fullResult = this.selectUserResult.jsonTest;
            }
        },
        mounted() {
            this.$store.dispatch('getUsersTest');
        },
        destroyed(){
            this.userId = null;
            this.testId = null;
            this.resultId = null;
        }
    };
</script>
<style lang="scss" scoped>
    .question-success-y {
        color: #68c968;
    }
    .question-success-n {
        color: #e58b3c;
    }
</style>
