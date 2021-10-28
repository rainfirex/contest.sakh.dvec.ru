<template>
    <div class="group-operator">

        <div class="text-center mt-3 mb-3">
            <button class="btn btn-secondary" @click="isCreate = true">Новая группа</button>
        </div>

        <div class="fix-background" v-if="isCreate" @click="isCreate = false">
            <div class="form-content" @click.stop="">
                <h3 class="text-center">Создание группы</h3>
                <div class="form-group">
                    <label for="">Название</label>
                    <input type="text" class="form-control" v-model="operationGroup.title">
                </div>
                <div class="form-group">
                    <label for="">Описание</label>
                    <input type="text" class="form-control" v-model="operationGroup.description">
                </div>
                <div class="text-center mt-3">
                    <button class="btn btn-outline-secondary" @click="createOperationGroup">Создать</button>
                    <button class="btn btn-outline-secondary" @click="isCreate = false">Закрыть</button>
                </div>
            </div>
        </div>

        <table class="table table-striped table-dark" v-if="operatorGroups.length > 0">
            <thead>
            <tr class="text-center">
                <th>Название</th>
                <th>Описание</th>
                <th>Управление</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(group, index) in operatorGroups">
                <td>
                    <div v-if="currentIndex === index">
                        <input type="text" class="form-control" v-model="group.title">
                    </div>
                    <div v-else>{{ group.title }}</div>
                </td>
                <td>
                    <div v-if="currentIndex === index">
                        <input type="text" class="form-control" v-model="group.description">
                    </div>
                    <div v-else>{{ group.description }}</div>
                </td>
                <td style="width: 210px">
                    <div v-if="currentIndex === index">
                        <button class="btn btn-outline-success" @click="updateOperationGroup(group)">Обновить</button>
                    </div>
                    <div v-else>
                        <button class="btn btn-outline-primary" @click="selectRow(index)">изменить</button>
                        <button class="btn btn-outline-danger" @click="destroyOperationGroup(group.id, index)">удалить</button>
                    </div>

                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        computed:{
            operatorGroups(){
                return this.$store.getters.getOperatorGroups;
            },
            currentIndex() {
                return this.$store.getters.getCurrentIndex;
            }
        },
        data(){
            return {
                isCreate: false,
                operationGroup: {
                    title: null,
                    description: null
                }
            }
        },
        methods:{
            createOperationGroup(){
                if(this.operationGroup.title == null) {
                    this.$store.dispatch('setErrorTitleAndText', {title: 'Отказ', text: 'Заполните поле "название"'});
                    return;
                }
                this.$store.dispatch('createOperationGroup', this.operationGroup)
            },
            destroyOperationGroup(id, index){
                this.$store.dispatch('destroyOperationGroup', {id, index})
            },
            selectRow(index) {
                this.$store.dispatch('setCurrentIndex', index);
            },
            updateOperationGroup(group){
                this.$store.dispatch('updateOperationGroup', group);
            }
        },
        mounted(){
            this.$store.dispatch('getOperationGroups');
        }
    };
</script>
<style lang="scss" scoped>

</style>
