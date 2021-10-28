<template>
    <div class="Answer">
        <!-- Информация о билете -->
        <div class="form-content">
            <h3 class="text-center mb-2">Редактор ответов</h3>

            <div class="question-info" v-if="question && question.category">
                <p class="mb-0"><b>Выбрана категория:</b> {{ question.category.title }}</p>
                <p class="mb-0"><b>Текст вопроса:</b> {{ question.title }}</p>
                <div class="row">
                    <div class="col-6">
                        <p class="mb-0"><b>Необходимые баллы:</b> {{ question.score }}</p>
                    </div>
                    <div class="col-6">
                        <p class="mb-0"><b>Номер билета:</b> {{ question.number }}</p>
                    </div>
                </div>
            </div>
            <!-- Форма создания ответов -->
            <div class="form-group mb-3">
                <div class="col-12">
                    <label for="title" class="col-form-label">Текст ответа</label>
                </div>
                <div class="col-12">
                    <textarea id="title" class="form-control" v-model="title"></textarea>
                </div>
            </div>
            <!-- Балл и номер -->
            <div class="form-group">
                <div class="col-12 row">
                    <div class="col-3">
                        <label for="score" class="col-form-label">Номер ответа</label>
                    </div>
                    <div class="col-2">
                        <input type="number" id="score" class="form-control" v-model="number"/>
                    </div>
                    <div class="col-3">
                        <label for="number" class="col-form-label">Баллов за ответ</label>
                    </div>
                    <div class="col-2">
                        <input type="number" id="number" class="form-control" v-model="score"/>
                    </div>
                </div>
            </div>
            <!-- Кнопка -->
            <div class="text-center mt-3">
                <button class="btn btn-outline-primary" @click="backQuestion">Назад</button>
                <button class="btn btn-outline-secondary" @click="createAnswer">Создать</button>
            </div>
        </div>
        <!-- Список ответов -->
        <div class="form-content" v-if="answers.length > 0">
            <h3 class="text-center mb-3">Список ответов на вопрос</h3>
            <div class="list-container">
                <ul class="list-group">
                    <li class="list-group-item" :class="{'select-li': parseInt(index) === parseInt(selectedIndex)}" v-for="(answer, index) in answers" @dblclick="editAnswer(index, answer)" title="Двойной клик для редактирования">
                        <div v-if="selectedIndex === index">
                            <div class="form-group mb-3">
                                <label for="editTitle" class="col-form-label">Текст ответа</label>
                                <textarea id="editTitle" class="form-control" v-model="answer.title"></textarea>
                            </div>
                            <div class="form-group">
                                <div class="col-12 row">
                                    <div class="col-3">
                                        <label for="editScore" class="col-form-label">Номер ответа</label>
                                    </div>
                                    <div class="col-2">
                                        <input type="number" id="editScore" class="form-control" v-model="answer.number"/>
                                    </div>
                                    <div class="col-3">
                                        <label for="editNumber" class="col-form-label">Баллов за ответ</label>
                                    </div>
                                    <div class="col-2">
                                        <input type="number" id="editNumber" class="form-control" v-model="answer.score"/>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <button class="btn btn-outline-secondary" @click="stopEditAnswer(answer)">Отмена</button>
                                <button class="btn btn-outline-secondary" @click="updateAnswer(answer)">Изменить</button>
                            </div>
                        </div>
                        <div v-else>
                            <div class="row">
                                <div class="col-10 command-text">
                                    <p class="mb-0">{{ answer.title }}</p>
                                </div>
                                <div class="col-2 command-button">
                                    <button class="btn btn-outline-danger " @click="deleteAnswer(answer.id, index)" title="Удалить ответ">удалить</button>
                                </div>
                            </div>
                            <p class="mb-0">№ <span class="text-danger"><b>{{ answer.number }}</b></span> | баллов: <span class="text-primary"><b>{{ answer.score }}</b></span></p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        computed: {
            questionId(){
                return this.$route.params.id;
            },
            question(){
                return this.$store.getters.getQuestion;
            },
            answers(){
                return this.$store.getters.getAnswers;
            },
            n_number(){
                return this.$store.getters.getNewAnswer.number;
            },
            n_title(){
                return this.$store.getters.getNewAnswer.title;
            },
            n_score(){
                return this.$store.getters.getNewAnswer.score;
            }
        },
        data(){
          return {
              title: null,
              number: 1,
              score: 0,
              selectedIndex: null,
              tmpTitle: null,
              tmpNumber: 0,
              tmpScore: 0
          }
        },
        methods:{
            // отобразить ошибку
            initResponseError(error){
                this.$emit('initResponseError', error);
            },
            // Создать ответ
            createAnswer(){
                if (this.questionId == null || this.title == null) {
                    const message = {message: 'Заполните все поля и попробуйте снова.'};
                    const response = {statusText: 'Ошибка заполнения', data: message};
                    const error = {response};
                    this.initResponseError(error);
                    return;
                }
                this.$store.dispatch('setNewAnswer', {
                    number: this.number,
                    title: this.title,
                    score: this.score
                });
                this.$store.dispatch('createAnswer', this.questionId);
            },
            // удалить ответ
            deleteAnswer(id, index){
                this.$store.dispatch('destroyAnswer' , { id, index });
            },
            editAnswer(index, answer){
                this.selectedIndex = index;
                this.tmpTitle = answer.title;
                this.tmpNumber = answer.number;
                this.tmpScore = answer.score;
            },
            stopEditAnswer(answer){
                answer.title = this.tmpTitle;
                answer.number = this.tmpNumber;
                answer.score = this.tmpScore;
                this.selectedIndex = null;
            },
            updateAnswer(answer){
                this.$store.dispatch('updateAnswer', answer);
                this.selectedIndex = null;
            },
            backQuestion(){
                this.$router.push(`/admin/question`);
            }
        },
        mounted(){
            this.$store.dispatch('getQuestionAndAnswers', this.questionId);
        },
        watch: {
            n_number(){
                this.number = this.n_number;
            },
            n_score() {
                this.score = this.n_score;
            },
            n_title(){
                this.title = this.n_title;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .question-info{
        line-height: 35px;
    }
    .form-group{
        &.row{
            align-items: center;
        }
    }
    .list-group-item{
        cursor: pointer;
        overflow: auto;
        user-select: none;
    }
    .command-text{
        line-height: 25px;
    }
    .command-button{
        text-align: center;
        align-self: center;
    }
    .list-container{
        max-height: 780px;
        overflow: auto;
    }
    .select-li{
        background: #ededed;
    }
</style>
