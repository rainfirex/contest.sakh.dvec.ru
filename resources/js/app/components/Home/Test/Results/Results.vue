<template>
    <div class="results p-4">
        <div v-if="results && results.length > 0">
            <h3 class="text-center mb-4 mt-4">Завершенные тесты</h3>
            <div class="mb-4 p-3 test-result" v-for="(result, index) in results" :key="index">
                <h3>{{ result.date }}</h3>
                <p class="mb-0" v-if="result.result || result.stoped || result.timeout">
                    <b class="question-success-y" v-if="result.result">Тест пройден</b>
                    <b class="question-success-n" v-if="result.stoped">Тест прерван</b>
                    <b class="question-success-n" v-if="result.timeout">Вышло время</b>
                    / {{ result.testName }}</p>
                <p class="mb-0">Правильно отвеченых вопросов: <span class="question-success-y">{{ result.success }}</span>,
                    с ошибками <span class="question-success-n">{{ result.fails }}</span></p>
                <p class="mb-0">Начало тестирования: {{ result.timeStart }}, завершено в: {{ result.timeStop }}</p>
                <p class="mb-0" v-if="result.result">Пройдено за: {{ result.timeInterval }}</p>
                <hr>
                <p class="mb-0">Подробно посмотреть можно <router-link :to="'/result-test/user/'+ user.id+'/main-test/'+result.testId">здесь</router-link><span style="float: right;cursor: pointer" @click="removeResultInStorage(index)">X</span></p>

            </div>
        </div>
        <div v-else>
            <p>У вас нет завершенных тестов, но их можно пройти <router-link to="/main-test">здесь</router-link></p>
        </div>
    </div>
</template>

<script>
    export default {
        computed:{
            user(){
                return this.$store.getters.getUser;
            },
            results(){
                return this.$store.getters.getResultsMainTest;
            }
        },
        methods:{
          removeResultInStorage(index){
              this.$store.dispatch('removeResultInStorage', index);
          }
        },
        mounted(){
            const result = localStorage.getItem("test-result");
            if (result !== null)
                this.$store.dispatch('setResultMainTest', JSON.parse(result));
        }
    };
</script>
<style lang="scss" scoped>
    .results{
        user-select: none;
        .test-result{
            border: solid 1px;
            background: #747474;
            a{
                color: #9effed;
                &:hover{
                    color: #6edfca;
                }
            }
        }
        .timerTag{
            color: #68c968;
            font-size: 1.2em;
        }
        .is-empty-answer{
            color: #f59da5;
            background: #657685;
            padding: 10px;
            margin: 15px;
        }
        .question-success-y {
            color: #68c968;
        }
        .question-success-n {
            color: #e58b3c;
        }
    }
</style>
