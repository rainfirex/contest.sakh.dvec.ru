<template>
    <div class="Question">
        <!-- Формы -->
        <div class="form-content">
            <h3 class="text-center mb-2">Редактор вопросов</h3>

            <div class="mb-3">
                <!-- Категория -->
                <p class="mb-0">Категория (тест)</p>
                <div class="form-group row">
                    <div class="col-lg-7 select-question">
                        <select class="form-control" v-model="categoryId" @change="selectOptionCategory">
                            <option :value="category.id" v-for="(category, index) in categories" :key="category.id">
                                {{ category.title }}
                            </option>
                        </select>
                    </div>
                    <div class="col-lg-5">
                        <button class="btn btn-outline-primary" @click.prevent="isEditCategory = !isEditCategory" :disabled="isEditCategory || isCreateCategory || isCreateQuestion"
                                title="Редактировать категорию">Редактировать
                        </button>
                        <button class="btn btn-outline-danger" @click.prevent="deleteCategory"
                                title="Удалить категорию">Удалить
                        </button>
                        <button class="btn btn-outline-secondary" @click.prevent="isCreateCategory = !isCreateCategory" :disabled="isCreateCategory || isEditCategory || isCreateQuestion"
                                title="Добавить категорию">Создать
                        </button>
                    </div>
                </div>

                <hr>

                <!-- Форма редактирование -->
                <div v-if="isEditCategory">
                    <h3 class="text-center mt-3">Изменить категорию</h3>
                    <div class="form-group row mb-2">
                        <!-- Название -->
                        <div class="col-10">
                            <p class="mb-0">Название теста</p>
                            <input type="text" class="form-control" v-model="testTitle">
                        </div>
                        <!-- Таймер -->
                        <div class="col-2">
                            <p class="mb-0">Таймер</p>
                            <input type="time" class="form-control" step="2" v-model="testTimer">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="" class="mb-1">Группа оператора (Редактировать тест сможет только этот оператор)</label>
                        <select class="form-control" v-model="testOperatorGroupId">
                            <option :value="userGroup.id" v-for="userGroup in userGroups">{{ userGroup.title }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <input id="is-enabledEdit" type="checkbox" v-model="testIsEnabled">
                        <label for="is-enabledEdit" class="form-check-label mb-1">Включен (тест будет отображаться пользователям)</label>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-outline-dark" @click="isEditCategory = false">Отмена</button>
                        <button class="btn btn-outline-primary" @click="updateCategory">Обновить</button>
                    </div>
                </div>

                <!-- Форма создание категории -->
                <div class="" v-if="isCreateCategory">
                    <h3 class="text-center mt-3">Новая категория (тест)</h3>
                    <div class="form-group">
                        <label for="" class="mb-1">Новая категория (тест)</label>
                        <input class="form-control" type="text" v-model="newCategory.title">
                    </div>
                    <div class="form-group">
                        <label for="" class="mb-1">Таймер (время на тест)</label>
                        <input class="form-control" type="time" v-model="newCategory.timer" step="2">
                    </div>
                    <div class="form-group">
                        <label for="" class="mb-1">Группа оператора (Редактировать тест сможет только этот оператор)</label>
                        <select class="form-control" v-model="newCategory.operator_group_id">
                            <option :value="userGroup.id" v-for="userGroup in userGroups">{{ userGroup.title }}</option>
                        </select>
                    </div>
                    <div class="form-group mt-2">
                        <input id="is-enabled" type="checkbox" v-model="newCategory.is_enabled">
                        <label for="is-enabled" class="form-check-label mb-1">Включен (тест будет отображаться пользователям)</label>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-outline-dark" @click="isCreateCategory = false">Отмена</button>
                        <button class="btn btn-outline-secondary" @click="createCategory">Создать</button>
                    </div>
                </div>

                <!-- Кнопка создания вопроса -->
                <div class="text-center mt-3" v-if="!isCreateQuestion">
                    <button class="btn btn-outline-secondary" @click.prevent="isCreateQuestion = !isCreateQuestion" :disabled="isCreateCategory || isEditCategory"
                            title="Новый вопрос">Новый вопрос</button>
                </div>
                <!-- Форма создание вопроса -->
                <div v-if="isCreateQuestion">
                    <h3 class="text-center mt-3">Новый вопрос</h3>
                    <!-- Текст вопроса -->
                    <div class="form-group">
                        <label for="">Текст вопроса</label>
                        <textarea class="form-control" v-model="question"></textarea>
                    </div>
                    <!-- Баллы и Номер билета -->
                    <div class="form-group">
                        <div class="row">
                            <div class="col-6">
                                <label for="">Номер вопроса</label>
                                <input class="form-control" type="number" min="1" max="100" v-model="number">
                            </div>
                            <div class="col-6">
                                <label for="">Необходимые баллы</label>
                                <input class="form-control" type="number" min="0" max="10" v-model="score">
                            </div>
                        </div>
                    </div>
                    <!-- Кнопка -->
                    <div class="text-center mt-2">
                        <button class="btn btn-outline-dark" @click="isCreateQuestion = false">Отмена</button>
                        <button class="btn btn-outline-secondary" @click.prevent="createQuestion">Создать</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Список вопросов -->
        <div class="form-content" v-if="category.title && category.questions.length > 0">
            <h3 class="text-center mb-3">Список вопросов выбраной категории (теста)</h3>
            <div class="list-container">
                <ul class="list-group">
                    <li class="list-group-item" :class="{'select-li': parseInt(index) === parseInt(selectedIndex)}" v-for="(question, index) in category.questions" :key="question.id" @dblclick="editQuestion(index, question)" title="Двойной клик для редактирования">
                        <div v-if="selectedIndex === index">
                            <div class="form-group mb-3">
                                <label for="editTitle" class="col-form-label">Текст ответа</label>
                                <textarea id="editTitle" class="form-control" v-model="question.title"></textarea>
                            </div>
                            <div class="form-group">
                                <div class="col-12 row">
                                    <div class="col-3">
                                        <label for="editScore" class="col-form-label">Номер вопроса</label>
                                    </div>
                                    <div class="col-2">
                                        <input type="number" id="editScore" class="form-control" v-model="question.number"/>
                                    </div>
                                    <div class="col-3">
                                        <label for="editNumber" class="col-form-label">Баллов за ответ</label>
                                    </div>
                                    <div class="col-2">
                                        <input type="number" id="editNumber" class="form-control" v-model="question.score"/>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <button class="btn btn-outline-secondary" @click="stopEditQuestion(question)">Отмена</button>
                                <button class="btn btn-outline-secondary" @click="updateQuestion(question)">Изменить</button>
                            </div>
                        </div>
                        <div v-else>
                            <div class="row">
                                <div class="col-9 command-text">
                                    <p class="mb-0">{{ question.title }}</p>
                                </div>
                                <div class="col-3 command-button">
                                    <button class="btn btn-outline-primary" @click="openAnswer(question.id)" title="Открыть вопрос">Открыть</button>
                                    <button class="btn btn-outline-danger" @click="deleteQuestion(question.id, index)" title="Удалить вопрос">удалить</button>
                                </div>
                            </div>
                            <p class="mb-0">№ <span class="text-danger">
                            <b>{{ question.number }}</b></span> | баллов: <span class="text-primary">
                            <b>{{ question.score }}</b></span></p>
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
            categories() {
                return this.$store.getters.getCategories;
            },
            category() {
                return this.$store.getters.getCategory;
            },
            n_number(){
                return this.$store.getters.getNewQuestion.number;
            },
            n_score(){
                return this.$store.getters.getNewQuestion.score;
            },
            n_title(){
                return this.$store.getters.getNewQuestion.title;
            },
            userGroups(){
                return this.$store.getters.getQuestionUserGroups;
            }
        },
        data() {
            return {
                isCreateQuestion: false,
                isCreateCategory: false,
                isEditCategory: false,
                newCategory: {
                    title: null,
                    timer: null,
                    is_enabled: false,
                    operator_group_id: null
                },
                categoryId: null,
                categoryIndex: null,
                testTitle: null,
                testTimer: null,
                testIsEnabled: false,
                testOperatorGroupId: null,

                questions: [],
                question: null,

                score: 0,
                number: 0,
                error: { title: null, text: null },
                selectedIndex: null,
                tmpTitle: null,
                tmpNumber: 0,
                tmpScore: 0
            }
        },
        methods: {
            // отобразить ошибку
            initResponseError(error) {
                this.$emit('initResponseError', error);
            },
            // Установить тек. категорию
            selectOptionCategory(e) {
                const idCategory = e.target.value;
                this.$store.dispatch('setCategoryById',  idCategory);
            },
            // Создать категорию
            createCategory() {
                if (this.newCategory.title == null || this.newCategory.timer == null || this.newCategory.operator_group_id == null) {
                    const message = {message: 'Заполните все поля и попробуйте снова.'};
                    const response = {statusText: 'Ошибка заполнения', data: message};
                    const error = {response};
                    this.initResponseError(error);
                    return;
                }
                this.$store.dispatch('createCategory', this.newCategory);
                this.newCategory = { title: null, timer:'00:00:00', isEnabled: false };
                this.isCreateCategory = false
            },
            // Обновить категорию
            updateCategory(){
                if(this.categoryId != null)
                {
                    if (this.testTitle == null || this.testTimer == null || this.testOperatorGroupId == null) {
                        const message = {message: 'Заполните все поля и попробуйте снова.'};
                        const response = {statusText: 'Ошибка заполнения', data: message};
                        const error = {response};
                        this.initResponseError(error);
                        return;
                    }

                    this.$store.dispatch('updateCategory', {
                        'categoryId': this.categoryId,
                        'title' : this.testTitle,
                        'timer': this.testTimer,
                        'is_enabled' : this.testIsEnabled,
                        'operator_group_id': this.testOperatorGroupId
                    });
                }
            },
            // Удалить категорию
            deleteCategory() {
                if (this.categoryId == null) {
                    const message = {message: 'Выберите категорию и попробуйте снова.'};
                    const response = {statusText: 'Ошибка заполнения', data: message};
                    const error = {response};
                    this.initResponseError(error);
                    return;
                }
                this.$store.dispatch('destroyCategory');
            },
            // Создать вопрос
            createQuestion() {
                if (this.categoryId == null || this.question == null) {
                    const message = {message: 'Заполните все поля и попробуйте снова.'};
                    const response = {statusText: 'Ошибка заполнения', data: message};
                    const error = {response};
                    this.initResponseError(error);
                    return;
                }
                this.$store.dispatch('setNewQuestion', {
                    number: this.number,
                    title: this.question,
                    score: this.score
                });
                this.$store.dispatch('createQuestion');
            },
            // Удалить вопрос
            deleteQuestion(id, index) {
                this.$store.dispatch('destroyQuestion', {id, index});
            },
            // Обновить вопрос
            updateQuestion(question){
                this.$store.dispatch("updateQuestion", question);
                this.selectedIndex = null;
            },
            editQuestion(index, question) {
                this.selectedIndex = index;
                this.tmpTitle = question.title;
                this.tmpNumber = question.number;
                this.tmpScore = question.score;
            },
            stopEditQuestion(question) {
                question.title = this.tmpTitle;
                question.number = this.tmpNumber;
                question.score = this.tmpScore;

                this.selectedIndex = null;
            },
            openAnswer(questionId){
                this.$router.push(`/admin/answer/${ questionId }`);
            }
        },
        mounted(){
            this.$store.dispatch('categories');
        },
        created(){
            if(this.category){
                this.categoryId = this.category.id;
                this.testTitle = this.category.title;
                this.testTimer = this.category.timer;
                this.testIsEnabled = this.category.is_enabled;
                this.testOperatorGroupId = this.category.operator_group_id;
            }
            this.score = this.n_score;
            this.number = this.n_number;
            this.question = this.n_title;
        },
        watch: {
            n_number(){
                this.number = this.n_number;
            },
            n_score() {
                this.score = this.n_score;
            },
            n_title(){
                this.question = this.n_title
            },
            category(){
                this.testTimer = this.category.timer;
                this.testTitle = this.category.title;
                this.testIsEnabled = this.category.is_enabled;
                this.testOperatorGroupId = this.category.operator_group_id;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .select-question {
        align-self: center;
    }
    .text-question {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 80%;
    }
    .list-group-item{
        cursor: pointer;
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
