// register_window.js

//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

var window_bg = "images/rank_bg.png"
var btn_ok_image = "images/btn_ok.png"
var btn_return_image = "images/btn_return.png"
var window_size = [850,1300]

function create_text_box(label, x, y)
{
    var font_size = 50;
    var input_width = 400;
    var input_height = 60;
    var wnd = new Container();
    wnd.x = x;
    wnd.y = y;

    var text = createText(label, font_size, '0x030303', 0, 0);
    var input = new PixiTextInput("", {
        fontSize : font_size, 
    });
    input.width = input_width;
    input.height = input_height;
    input.x = 200;
    input.y = 0;

    wnd.addChild(text);
    wnd.addChild(input);

    return wnd;
}

class RegisterWindow
{
    constructor(x, y)
    {
        // Create rank window sprite
        var window = new Container();
        this.window = window;
        var width = window_size[0];
        var height = window_size[1];
        window.x = x - width / 2;
        window.y = y;

        // Create bg sprite
        var bg = new Sprite(resources[window_bg].texture);
        resize_sprite(bg, width, height);
        window.addChild(bg);

        // Text
        var label = createText("来者何人？", 60, "0x040404", width/2, 180);
        label.anchor.set(0.5);
        window.addChild(label);
        label = createText("学生登陆才可参与排行榜争夺", 35, "0x111111", width/2, 300);
        label.anchor.set(0.5);
        window.addChild(label);

        label = createText("请填写真实信息，以确保可以领取奖励哦！", 30, "0x111111", width/2, height - 350);
        label.anchor.set(0.5);
        window.addChild(label);

        // Create input fileds
        var xoff= 100;
        var yoff = 400, ygap = 120;
        var input;

        input = create_text_box("姓名", xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box("学校", xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box("学号", xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box("手机", xoff, yoff);
        window.addChild(input);

        // Create buttons
        var ok_btn = createButton(btn_ok_image, width/2 - 150, height - 200,
            function(){
                // TODO: connect to server and register
            }
        );
        ok_btn.scale.set(1.5);

        var ret_btn = createButton(btn_return_image, width/2 + 150, height - 200,
            function(){
                stage.removeChild(window);
            }
        );
        ret_btn.scale.set(1.5);
        this.window.addChild(ok_btn);
        this.window.addChild(ret_btn);
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }
}

