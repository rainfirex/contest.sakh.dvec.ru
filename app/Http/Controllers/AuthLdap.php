<?php

namespace App\Http\Controllers;

use App\Services\LdapAuthService;
use \App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthLdap extends Controller
{

    /**
     * @var LdapAuthService
     */
    private $ldapAuthService;

    /**
     * ControllerAuth constructor.
     * @param LdapAuthService $ldapAuthService
     */
    public function __construct(LdapAuthService $ldapAuthService)
    {
        $this->middleware('auth:api')->only('logout', 'auth_user');
        $this->ldapAuthService = $ldapAuthService;
    }

    public function login(Request $request)
    {
        $login = $request->input('login');
        $password = $request->input('password');

        if (empty($login) || empty($password)) {
            return response()->json([
                'success'  => false,
                'message' => 'Не указан логин или пароль'
            ]);
        }

        if(!$this->ldapAuthService->loadConfig($host, $domain, $ldapDn)){
            return response()->json([
                'success' => false,
                'message' => 'Файл настроек LDAP не обнаружен!'
            ]);
        }

        if($this->ldapAuthService->ldapConnect($login, $password)){
            $userData = $this->ldapAuthService->getUserInfo($login);

            if(empty($userData)){
                return response()->json(['success'  => false, 'message' => 'Пользователь не найден!']);
            }

            $user = User::whereName($userData['username'])->first();
            if($user == null){
                $user = new User();
                $user->is_handler = 0;
                $user->is_admin = 0;
            }

            $user->password = bcrypt($password);
            $user->name = $userData['username'];
            $user->email = $userData['email'];
            $user->phone = $userData['phone'];
            $user->mobile = $userData['mobile'];
            $user->othertelephone = $userData['othertelephone'];
            $user->department = $userData['department'];
            $user->title = $userData['title'];
            $user->api_token = Str::random(60);
            $user->last_ip = $_SERVER['REMOTE_ADDR'];
            $user->user_agent = $_SERVER['HTTP_USER_AGENT'];

            $user->save();

            return response()->json([
                'success' => true,
                'user'    => $user,
                'message' => 'Вы авторизовались.'
            ], 200);

        }else{
            return response()->json([
                'success' => false,
                'message' => 'Учетные данные неверны, возможно вы ошиблись. Повторите попытку.'
            ], 200);
        }
    }

    public function logout(){
        $user = Auth::user();
        $user->api_token = '';
        $success = $user->save();
        return response()->json(compact('success'));
    }

    public function auth_user()
    {
        $user = Auth::user();
//        $user = $user->only(['id', 'name', 'email', 'department', 'title', 'mobile', 'phone',  'othertelephone', 'is_handler', 'is_admin', 'last_ip', 'api_token', 'created_at', 'updated_at', 'user_agent']);
        return response()->json(compact('user'));
    }
}
