<template>
    <div class="main-test p-4">
        <h4 class="text-center">Основной тест</h4>
        <div class="offset-1 col-10">
            <div class="form-group mb-3">
                <label for="category" class="col-form-label">Выберите тест</label>
                <select id="category" class="form-control" v-model="categoryId" @change="changeTest" :disabled="go" >
                    <option :value="test.id" v-for="test in tests" v-if="test.is_enabled">{{ test.title }}</option>
                </select>
            </div>
            <div class="text-center m-3">
                <button class="btn btn-secondary btn-lg" @click="start_test" :disabled="go">Приступить</button>
                <button class="btn btn-secondary btn-lg" @click="stop_test" :disabled="!go">Остановить</button>
            </div>
        </div>
        <div v-if="go && test">
            <h3 class="text-center mt-4 mb-4">
                Вопросы&nbsp;<span v-if="test.questions">{{ currIndexQuestion + 1 }}/{{ test.questions.length }}</span>
            </h3>
            <p class="text-center">Время на выполнение теста:&nbsp;<span class="timerTag" v-if="timerTag">{{ timerTag }}</span></p>
            <div class="text-center mt-3 mb-3">
                <button class="btn btn-lg btn-outline-warning" @click="toAnswerClick">Ответить</button>
                <div class="is-empty-answer" style="cursor:pointer;" v-if="isEmptyAnswer" @click="isEmptyAnswer = false">
                    <p class="mb-0">Необходимо указать минимум один ответ.</p>
                </div>
            </div>
            <!-- Вопросы-->
            <div class="test">
                <ul class="mb-4">
                    <li v-for="(question, index) in test.questions" class="question" :class="{active: index === currIndexQuestion}" >{{ question.title }}
                        <ul class="answers pt-4 pb-4">
                            <li class="mb-4 answer" v-for="answer in question.answer">
                                <label class="answer-cursor">
                                    <input type="checkbox" class="checkbox" v-model="answer.checked"> {{ answer.title }}
                                </label>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="result && result.testId">
            <h3 class="text-center mb-4 mt-4">Завершенные тесты</h3>
            <div class="mb-4 p-3 test-result">
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
                <p class="mb-0">Подробно посмотреть можно <router-link :to="'/result-test/user/'+ user.id+'/main-test/'+result.testId">тут</router-link></p>
            </div>
        </div>
    </div>
</template>
<script>
    import DateFunctions from "../../../../assets/js/DateFunctions";
    export default {
        computed: {
            user(){
                return this.$store.getters.getUser;
            },
            tests() {
                return this.$store.getters.getTests;
            },
            currentMainTest(){
                return this.$store.getters.getCurrentTest;
            }
        },
        data(){
          return {
              timerTag: '00:00:00',
              timer: null,
              timerResource: null,
              go: false,
              categoryId: null,
              currIndexQuestion: 0,
              test: {},
              isEmptyAnswer: false,

              timeStartTest: 0,
              timeStopTest: 0,
              result: {},
              intervalUpdate: null
          }
        },
        methods:{
            changeTest(e){
                const idTest = e.target.value;
                this.$store.dispatch('selectTestById', idTest);
            },
            // Начать тест
            start_test(){
                if(this.currentMainTest.title) {
                    // Копирование объекта
                    this.test = this.makeCopy(this.currentMainTest);
                    this.go = true;
                    this.currIndexQuestion = 0;
                    // Иниц. таймер
                    this.timeStartTest = Date.now();
                    this.initTimer(this.test.timer);
                    // Запуск таймера
                    if(this.timerResource == null){
                        this.timerResource = setInterval(this.timerStart, 1000);
                    }
                } else {
                    this.$emit('showError', {title: 'Ошибка', text: 'Не выбран тест!'});
                }
            },
            // Обработка теста перед хранением
            processingTest(){
                let countSuccess = 0;
                let countError = 0;
                this.test.questions.forEach(item => {
                    const question = item;

                    const numberQuestion = question.number;
                    const scoreQuestion = question.score;
                    let allScore = 0;
                    let isFail = false;
                    question.answer.forEach(itm => {
                        const numberAnswer = itm.number;
                        const scoreAnswer = itm.score;

                        if(itm.checked){
                            if(parseInt(scoreAnswer) !== 0){
                                itm.success = true;
                                allScore += parseInt(scoreAnswer);
                            }
                            else{
                                itm.success = false;
                                isFail = true;
                            }
                        }
                    });

                    if(parseInt(scoreQuestion) === parseInt(allScore)){
                        question.success = true;
                    }
                    else
                    {
                        question.success = false;
                    }
                    if(isFail){
                        question.success = false;
                    }

                    if(question.success === true)
                        countSuccess++;
                    else
                        countError++;
                });

                return {
                    testId: null,
                    testName: this.test.title,
                    date: DateFunctions.currentDate(),
                    success: countSuccess,
                    fails: countError,
                    timeStart: new Date(this.timeStartTest).toLocaleTimeString(),
                    timeStop: new Date(this.timeStopTest).toLocaleTimeString(),
                    timeInterval: new Date(2021, 10, 14, 0, 0, 0, (Math.floor(this.timeStopTest - this.timeStartTest))).toLocaleTimeString()
                };
            },
            // отправить на сервер
            sendToServer(result){
                this.$store.dispatch('storeResultTest', {
                    'user_id': this.user.id,
                    'category_id' : this.categoryId,
                    'jsonTest': JSON.stringify(this.test),
                    'result' : result
                });
            },
            // Тест пройден
            finish_test(){
                this.timerStop();

                const info = this.processingTest();
                info.result = true;
                info.timeout = false;
                info.stoped  = false;
                // Информация с результатом
                this.result = info;

                this.sendToServer(info);
            },
            // Время на прохождение тест закончено
            timeout_test(){
                this.timerStop();

                const info = this.processingTest();
                info.result  = false;
                info.timeout = true;
                info.stoped  = false;
                this.result  = info;
                this.sendToServer(info);
            },
            // Тест прерван пользователем
            stop_test(){
                this.timerStop();

                const info = this.processingTest();
                info.result  = false;
                info.timeout = false;
                info.stoped  = true;
                this.result  = info;
                this.sendToServer(info);
            },
            // Пользователь делает ответ
            toAnswerClick(){
                if (this.test == null) return;
                // Если пользователь совершил ответ
                if(this.isAnswerUser()) {
                    this.isEmptyAnswer = false;
                    if((this.test.questions.length -1 ) > this.currIndexQuestion ){
                        this.currIndexQuestion++;
                    }
                    else
                        this.finish_test();
                }
                else
                    this.isEmptyAnswer = true;
            },
            // Запустить таймер
            timerStart(){
                const h = this.timer.getHours();
                const m = this.timer.getMinutes();
                const s = this.timer.getSeconds() - 1;
                this.timer.setSeconds(s);
                this.timerTag = this.timer.toLocaleTimeString();
                // Таймауте
                if(h <= 0 && m <= 0 && s <= 0) {
                    this.timeout_test();
                }
            },
            // Остановить таймер
            timerStop(){
                clearInterval(this.timerResource);
                this.go = false;
                this.currIndexQuestion = 0;
                this.timerResource = null;
                this.timeStopTest = Date.now();
            },
            // Копирование объекта
            makeCopy(object){
                const newObject = JSON.parse(JSON.stringify(object));
                newObject.questions.sort(() => 0.5 - Math.random());
                newObject.questions.forEach(item => {
                    item.answer.sort(() => 0.5 - Math.random());
                });
                return newObject;
            },
            // Иниц. таймер
            initTimer(timerString){
                const timeArray = timerString.split(':');
                this.timer = new Date();
                this.timer.setHours(timeArray[0]);
                this.timer.setMinutes(timeArray[1]);
                this.timer.setSeconds(timeArray[2]);
            },
            // Проверить совершил ли пользователь ответ
            isAnswerUser() {
                const questions = this.test.questions[this.currIndexQuestion];
                const answers = questions.answer;
                const ans = answers.filter(item => item.checked === true);
                return (ans.length > 0) ? true : false;
            },
            // Постоянное обновление тестов
            updateTest(){
                this.intervalUpdate = setInterval(() => {
                    if(this.go === false){
                        this.$store.dispatch('tests');
                    }
                }, 60000);
            }
        },
        mounted() {
            this.$store.dispatch('tests');

            this.updateTest();

            const result = localStorage.getItem("test-result");
            if (result !== null)
                this.$store.dispatch('setResultMainTest', JSON.parse(result));
        },
        destroyed() {
            clearInterval(this.intervalUpdate);
            clearInterval(this.timerResource);
        }
    };
</script>
<style lang="scss" scoped>
    .main-test{
        user-select: none;
        .test{
            min-height: 440px;
            overflow: auto;
        }
        ul{
            list-style: none;
        }
        .question{
            display: none;
            font-size: 1.2em;
            position: relative;
            line-height: 33px;
            color: #ffffff;
            &.active{
                display: block;
            }
            .answers{
                .answer{
                    font-size: 0.8em;
                    color: #d3d2d2;
                    .answer-cursor{
                        cursor: pointer;
                    }
                }
                .checkbox{
                    width: 17px;
                    height: 17px;
                }
            }
        }
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
