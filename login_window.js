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
    create_simple_button(name, x, y, func)
    {
        var btn_scale = 4;
        var text_offx = 50;
        var text_offy = 32;

        var btn = new Sprite(resources[button_image].texture);
        btn.scale.x = btn_scale;
        btn.scale.y = btn_scale;
        btn.interactive = true;
        btn.on('pointerdown', func);

        var textStyle = {
            fontSize : 36,
            fill : '#ffffff',
        };
        var basicText = new PIXI.Text(name, textStyle);
        basicText.x = x + text_offx;
        basicText.y = y + text_offy;
        btn.x = x;
        btn.y = y;

        this.window.addChild(btn);
        this.window.addChild(basicText);
        return btn;
    }

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

        var text = createText('寻找有趣的灵魂', 60, '0xffffff', canvas_width / 2, 500);
        text.anchor.set(0.5);
        window.addChild(text);

        this.create_simple_button("  排行榜 ", 100, canvas_height / 2, function() {
            console.log("排行榜");
            show_rank_window();
        });
        this.create_simple_button("学生登录", canvas_width / 2 - 120, canvas_height / 2, function() {
            console.log("学生登陆");
            show_register_window();
        });
        this.create_simple_button("游客登录", canvas_width - 350, canvas_height / 2, function() {
            console.log("游客登录");
            show_start_window();
        });

        text = createText('(注意：填写实名信息并以学生登陆才可参与排行抽奖)', 
                26, '0x444444', canvas_width / 2, canvas_height - 180);
        window.addChild(text);
        text.anchor.set(0.5);

        text = createText('找有趣的灵魂·赢取万元大奖', 
                40, '0x444444', canvas_width / 2, canvas_height / 2 + 400);
        text.anchor.set(0.5);
        window.addChild(text);

        var gift_interval = 50;
        var gift_x = 180;
        var height_off = -300;
        for (var i = 0; i < 5; i++)
        {
            var gift_bg = new Sprite(resources[gift_bg_image].texture);
            gift_bg.anchor.set(0.5);
            gift_bg.pivot.set(0.5);
            gift_bg.scale.set(2.0);
            var gift_sprite = new Sprite(resources["images/gift{0}.png".format(i+1)].texture);
            gift_sprite.anchor.set(0.5);
            gift_bg.x = gift_x + i * (gift_sprite.width + gift_interval);
            gift_bg.y = canvas_height + height_off;
            gift_sprite.x = gift_x + i * (gift_sprite.width + gift_interval);
            gift_sprite.y = canvas_height + height_off;
            gift_sprite.scale.set(0.8);
            window.addChild(gift_bg);
            window.addChild(gift_sprite);
        }    
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }
}
