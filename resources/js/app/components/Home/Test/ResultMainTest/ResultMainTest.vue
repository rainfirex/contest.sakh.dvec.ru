<template>
    <div class="main-test-result p-4">
        <h3 class="text-center mb-3">Результат</h3>

        <div class="p-4" v-if="test">
            <div class="text-center mb-3">
                <button class="btn btn-lg btn-secondary" @click="$router.go(-1)">Вернуться назад</button>
            </div>
            <div class="test-form p-4 m-3">
                <p class="mb-0">Название теста: {{test.title}}</p>
            </div>
            <ul>
                <li v-for="question in test.questions">
                    <p :class="{'question-success-y': question.success, 'question-success-n': !question.success}">
                        {{ question.title }}</p>
                    <ul>
                        <li v-for="answer in question.answer">
                            <p>{{ answer.title }}<span class="user-answer" v-if="answer.checked"> - (ваш ответ)</span>
                            </p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="text-center mt-3">
            <button class="btn btn-lg btn-secondary" @click="$router.go(-1)">Вернуться назад</button>
        </div>
    </div>
</template>
<script>
    export default {
        computed: {
            userId() {
                return this.$route.params.userId;
            },
            testId() {
                return this.$route.params.testId;
            },
            test() {
                console.dir(
                    this.$store.getters.getResultTest
                );
                return this.$store.getters.getResultTest;
            }
        },
        mounted() {
            this.$store.dispatch('getTestResult', this.testId);
        }
    };
</script>
<style lang="scss" scoped>
    .main-test-result {

        .test-form{
            user-select: none;
            border: solid 1px;
            background: #747474;
        }
        .question-success-y {
            color: #68c968;
        }
        .question-success-n {
            color: #e58b3c;
        }
        .user-answer {
            color: #9ed2ff;
        }
    }
</style>
