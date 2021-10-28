<template>
    <div class="users">
        <div class="form-group bg-light p-2 offset-4 col-4 mb-3">
            <p class="mb-1 text-center">Поиск пользователя</p>
            <input type="search" class="form-control" placeholder="имя пользователя..." v-model="textSearch">
            <p class="mb-0">Пользователей системы: {{ users.length }}</p>
        </div>
        <div v-if="users.length > 0">
            <table class="table table-striped table-dark">
                <thead>
                <tr class="text-center">
                    <th>Имя пользователя</th>
                    <th>Должность</th>
                    <th>department</th>
                    <th>Почта</th>
                    <th>Телефон</th>
                    <th>Оператор</th>
                    <th>Админ</th>
                    <th>Группа</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in users">
                    <td>{{ user.name }}</td>
                    <td>{{ user.title }}</td>
                    <td>{{ user.department }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td class="text-center">
                        <input type="checkbox" v-model="user.is_handler" @change="userUpdate(user)">
                    </td>
                    <td class="text-center">
                        <input type="checkbox" v-model="user.is_admin" @change="userUpdate(user)">
                    </td>
                    <td style="width: 100px">
                        <button class="btn btn-outline-primary" @click="editGroup(user)">назначить</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="fix-background" v-if="isEditGroup" @click="isEditGroup = false">
            <div class="form-content" @click.stop="">
                <div v-if="userGroups.length > 0">
                    <h3 class="text-center">Группы пользователя</h3>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-for="(group, index) in userGroups">{{ group.title }}
                            <div class="delete-user-group">
                                <button class="btn btn-outline-danger" @click="destroyUserGroup(group.pivot, index)">Удалить</button>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Добавить пользователю группу -->
                <div>
                    <h3 class="text-center">Назначить группу</h3>
                    <p>Выберите роль для пользователя <b>"{{ editUser.name }}"</b></p>
                    <div class="form-group">
                        <select class="form-control" v-model="currentGroupId" @change="selectGroup">
                            <option :value="group.id" v-for="group in operatorGroups">{{ group.title }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <p class="mb-0">Описание:</p>
                        <p>{{ currentGroup.description }}</p>
                    </div>
                    <div class="text-center mt-3 mb-3">
                        <button class="btn btn-outline-secondary" @click="addUserGroup">Добавить</button>
                        <button class="btn btn-outline-secondary" @click="isEditGroup = false">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            users(){
                return this.$store.getters.getUsers.filter(item => item.name.toLowerCase().indexOf(this.textSearch.toLowerCase()) !== -1);
            },
            operatorGroups(){
                return this.$store.getters.getOperatorGroups;
            },
            userGroups(){
                return this.$store.getters.getUserGroups;
            }
        },
        data(){
            return {
                isEditGroup: false,
                editUser: {},
                currentGroupId: null,
                currentGroup: {},
                textSearch: ''
            }
        },
        methods:{
            userUpdate(user){
                const u = {
                    'id':  user.id,
                    'is_admin':  user.is_admin,
                    'is_handler':  user.is_handler
                };
                this.$store.dispatch('updateUser', u)
            },
            editGroup(user){
                this.currentGroupId = null;
                this.currentGroup = {};
                this.isEditGroup = true;
                this.editUser = user;
                this.$store.dispatch('userGroups', this.editUser.id);
                this.$store.dispatch('getOperationGroups');
            },
            selectGroup(){
                this.currentGroup = this.operatorGroups.find(g => g.id === this.currentGroupId);
            },
            addUserGroup(){
                if(this.currentGroupId == null){
                    this.$store.dispatch('setErrorTitleAndText', {title: 'Отказ', text: 'группа не выбрана'});
                    return;
                }
                this.$store.dispatch('addUserGroup', { userId :this.editUser.id, groupId: this.currentGroup.id});
            },
            destroyUserGroup(pivot, index){
                this.$store.dispatch('destroyUserGroup', { pivotId : pivot.id, index: index});
            }
        },
        mounted(){
            this.$store.dispatch('users');
        }
    };
</script>
<style lang="scss" scoped>
    input[type=checkbox]{
        width: 25px;
        height: 25px;
        cursor: pointer;
    }
    .delete-user-group{
        position: absolute;
        right: 7px;
        top: 7px;
    }
</style>
