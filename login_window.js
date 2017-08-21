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
        var user_cookie = getCookie("userinfo");
        if (user_cookie)
        {
            console.log(user_cookie);
            user_info = JSON.parse(user_cookie); 
            name = user_info.name;
            var text = createText('欢迎回来，{0}'.format(name), 
                    30, '0xe4e4e4', canvas_width/2, canvas_height * 0.05);
            text.anchor.set(0.5);
            window.addChild(text);
        }

        var btn_xoff = canvas_width * 0.22;
        var btn_yoff = canvas_height * 0.27;
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

        /*
        this.create_simple_button("  排行榜 ", canvas_width / 2, canvas_height / 2 - 300, 
                function() {
                    console.log("排行榜");
                    show_rank_window();
                }
        );

        this.create_simple_button("学生登录", canvas_width / 2, canvas_height / 2 - 100, 
                function() {
                    console.log("学生登陆");
                    show_register_window();
                }
        );

        this.create_simple_button("进入游戏", canvas_width / 2, canvas_height / 2 + 100, 
                function() {
                    console.log("进入游戏");
                    show_start_window();
                }
        );
        */

        /*
        text = createText('(注意：填写实名信息并以学生登陆才可参与排行抽奖)', 
                26, '0x444444', canvas_width / 2, canvas_height - 180);
        window.addChild(text);
        text.anchor.set(0.5);

        text = createText('找有趣的灵魂·赢取万元大奖', 
                40, '0x444444', canvas_width / 2, canvas_height / 2 + 400);
        text.anchor.set(0.5);
        window.addChild(text);
        */

        /*
        var gift_interval = 50;
        var gift_x = 180;
        var height_off = -300;
        for (var i = 0; i < 5; i++)
        {
            var gift_bg = new Sprite(resources[gift_bg_image].texture);
            gift_bg.anchor.set(0.5);
            gift_bg.pivot.set(0.5);
            gift_bg.scale.set(1.2);
            var gift_sprite = new Sprite(resources["images/gift{0}.png".format(i+1)].texture);
            gift_sprite.anchor.set(0.5);
            gift_bg.x = gift_x + i * (gift_sprite.width + gift_interval);
            gift_bg.y = canvas_height + height_off;
            gift_sprite.x = gift_x + i * (gift_sprite.width + gift_interval);
            gift_sprite.y = canvas_height + height_off;
            gift_sprite.scale.set(0.8);
            window.addChild(gift_bg);
            window.addChild(gift_sprite);
        }*/   
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }
}

