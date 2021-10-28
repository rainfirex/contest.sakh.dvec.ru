export default {
    save(user){
        localStorage.setItem('id', user.id);
        localStorage.setItem('api_token', user.api_token);
        localStorage.setItem('name', user.name);
        localStorage.setItem('email', user.email);
        localStorage.setItem('phone', user.phone);
        localStorage.setItem('othertelephone', user.othertelephone);
        localStorage.setItem('mobile', user.mobile);
        localStorage.setItem('department', user.department);
        localStorage.setItem('title', user.title);
        localStorage.setItem('is_handler', user.is_handler);
        localStorage.setItem('is_admin', user.is_admin);
        localStorage.setItem('last_ip', user.last_ip);
        localStorage.setItem('user_agent', user.user_agent);
        localStorage.setItem('created_at', user.created_at);
        localStorage.setItem('updated_at', user.updated_at);
    },
    load(){
        const user = {};
        user.id   = localStorage.getItem('id');
        user.api_token = localStorage.getItem('api_token');
        user.name      = localStorage.getItem('name');
        user.email     = localStorage.getItem('email');
        user.phone     = localStorage.getItem('phone');
        user.mobile    = localStorage.getItem('mobile');
        user.department = localStorage.getItem('department');
        user.title      = localStorage.getItem('title');
        user.is_handler = this.isResult(localStorage.getItem('is_handler'));
        user.is_admin   = this.isResult(localStorage.getItem('is_admin'));
        user.auth =
            user.id !== null &&
            user.api_token !== null &&
            user.name !== null;

        //Токен авторизации api
        const token = user.api_token;
        const auth  = user.auth;

        if (token && auth) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }
        return user;
    },
    remove(){
        localStorage.removeItem('id');
        localStorage.removeItem('api_token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('othertelephone');
        localStorage.removeItem('mobile');
        localStorage.removeItem('department');
        localStorage.removeItem('title');
        localStorage.removeItem('is_handler');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('last_ip');
        localStorage.removeItem('user_agent');
        localStorage.removeItem('created_at');
        localStorage.removeItem('updated_at');
    },
    log(){
        console.dir(this.load());
    },
    isResult(value){
        switch (value) {
            case '1':
            case 1 :
            case true:
            case 'true':
                return true;
            case 0:
            case '0':
            case false:
            case 'false':
                return false;
            default:
                return  false;
        }
    }
}
