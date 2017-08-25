// login_window.js

//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

class LoginWindow
{
    constructor()
    {
        // Create rank window sprite
        var window = new Container();
        this.window = window;
        var width = canvas_width;
        var height = canvas_height;
        window.x = 0;
        window.y = 0;

        var login_bg = new Sprite(resources[login_bg_image].texture);
        fill_sprite(login_bg);
        window.addChild(login_bg);

        var name = "游客";

        // Read user info from cookie
        var user_cookie = getCookie("userinfo");
        if (user_cookie)
        {
            console.log(user_cookie);
            user_info = JSON.parse(user_cookie); 
            if (user_info.id)
                name = user_info.name;
        }

        // Show welcome message
        var text = createText('欢迎回来，{0}'.format(name), 
                30, '0xe4e4e4', canvas_width/2, canvas_height * 0.05);
        text.anchor.set(0.5);
        window.addChild(text);

        var btn_xoff = canvas_width * 0.22;
        var btn_yoff = canvas_height * 0.35;
        var btn_interval = canvas_height * 0.06;
        create_button(window, btn_student_image, 1, 
                canvas_width / 2 - btn_xoff, canvas_height - btn_yoff - btn_interval,
                function() {
                    console.log("学生登陆");
                    show_register_window();
                });

        create_button(window, btn_enter_game_image, 1, 
                canvas_width / 2 + btn_xoff, canvas_height - btn_yoff - btn_interval,
                function() {
                    console.log("进入游戏");
                    show_start_window();
                });

        create_button(window, btn_gift_image, 1,
                canvas_width / 2 - btn_xoff, canvas_height - btn_yoff + btn_interval,
                function() {
                    console.log("万元大奖");
                    show_gift_window();
                });

        create_button(window, btn_rank_image, 1,
                canvas_width / 2 + btn_xoff, canvas_height - btn_yoff + btn_interval,
                function() {
                    console.log("排行榜");
                    show_rank_window();
                });
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }
}

