<template>
    <div class="MessageError">
        <!-- Вывод ошибки -->
        <div class="error-box" v-if="error.title" @click="error.title = null">
            <div class="error" @click.stop="">
                <h3>{{ error.title}}</h3>
                {{ error.text }}
                <button class="btn btn-danger error-close" title="закрыть" @click="error.title = null">X</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            error(){
                return this.$store.getters.getError;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .error-box{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #30302fde;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        .error{
            position: relative;
            /* border: solid 1px #564a4a; */
            padding: 25px;
            text-align: justify;
            background: whitesmoke;
            min-height: 300px;
            max-height: 90%;
            min-width: 650px;
            overflow: hidden;
            max-width: 1100px;
            color: #5c5c5c;
            font-size: 1.2em;
            box-shadow: 1px 1px 9px -1px #1e1e1e;
            .error-close{
                position: absolute;
                right: 5px;
                top: 5px;
            }
        }
    }
</style>
