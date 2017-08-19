

//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

var player_image = "images/players/1.png";
var bg_image = "images/bg_sky.jpg"
var login_bg_image = "images/login_bg.jpg"
var start_bg_image = "images/start_bg.jpg"
var button_image = "images/button.png"
var rank_bg_image = "images/rank_bg.png"
var rank_mask_image = "images/rank_bg_mask.png"
var rank_window_image = "images/rank_window.png"
var rank_item_image = "images/rank_item.jpg"
var btn_return_image = "images/btn_return.png"
var btn_retry_image = "images/btn_retry.jpg"
var btn_rank_image = "images/btn_rank.jpg"
var brick_line_image = "images/brick_line.jpg"
var box_image = "images/death_box.png"
var star_image = "images/star.png"
var loading_image = "images/black_bg.jpg"
var gift_bg_image = "images/gift_box.png"

loader.add(loading_image)
    .load(start_loading);

var loading_percent = 0;
var loading_text;
function start_loading()
{
    var bg = new Sprite(resources[loading_image].texture);
    fill_sprite(bg);
    stage.addChild(bg);

    loading_text = createText('Loading 0%', 50, '0xffffff', canvas_width/2, canvas_height/2);
    loading_text.anchor.set(0.5);
    stage.addChild(loading_text);

    loading_loop();

    loader.progress = 0;
    loader
      .add(player_image)
      .add(bg_image)
      .add(login_bg_image)
      .add(start_bg_image)
      .add(button_image)
      .add(rank_bg_image)
      .add(rank_item_image)
      .add(rank_mask_image)
      .add(rank_window_image)
      .add(btn_return_image)
      .add(btn_retry_image)
      .add(btn_rank_image)
      .add(brick_line_image)
      .add(box_image)
      .add(star_image)
      .add(gift_bg_image)

    var gift_num = 5;
    for (var i = 1; i <= gift_num; i++)
        loader.add("images/gift{0}.png".format(i));

    loader.on('progress', on_loading_progress)
    loader.load(startup)
}

function on_loading_progress(e)
{
    loading_percent = e.progress;
    loading_text.text = "Loading {0}%".format(
        Math.floor(loading_percent).toString());
}

function loading_loop()
{
    if (loading_percent >= 100)
        return; 
    requestAnimationFrame(loading_loop);
    renderer.render(stage);
}

// Render config
var size = [canvas_width, canvas_height];
var ratio = size[0] / size[1];
var born_pos = [canvas_width/2, canvas_height/1.5];

// Game properties
var jmp_horz_speed = 6;
var jmp_vert_speed = 17;
var gravity = 30;
var level_height = 1200;
var gap_size_range = [500,600];
var gap_pos_range = 200;
var box_pos_info = [200, 800, 50];
var star_pos_info = [150, 500, 100];
var prepare_level = canvas_height / level_height;
var camera_focus_pos = canvas_height / 2;
var camera_pos = 0;
var player_size = [0,0]
var player_radius = 0;
var collide_radius = 0;
var collide_scale = 0.8;
var px = 0, py = 0;
var cur_level = 0;
var level_score = 0;
var star_score = 0;
var score_label;
var game_state = "login";
var bricks;
var boxes;
var stars;
var scene_obs = [];
var eat_stars = [];
var remove_obs = [];

// Security
var report_scroe = 20;
var op_list = [];

// Time
var start_time = 0;
var delta_time = 0;
var last_time = 0;
var last_touch_time = 0;
var touch_time_interval = 160;

// Create stage & render
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(size[0], size[1], null);
document.body.appendChild(renderer.view);renderer.view.style.position = 'absolute';renderer.view.style.left = '50%';renderer.view.style.top = '50%';renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
document.body.appendChild(renderer.view);
resize();

function resize() {
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    renderer.view.style.width = w + 'px';
    renderer.view.style.height = h + 'px';
}

window.onresize = resize;

//Define any variables that are used in more than one function
var cat, box, message, state;
var bg;

renderer.plugins.interaction.on('pointerdown', function(e) { 
    if (game_state == "play")
    {
        // Check touch internal
        if (last_time - last_touch_time < touch_time_interval)
            return;

        // Record touch time
        last_touch_time = last_time;

        var pos = e.data.global;
        if (pos.x < canvas_width / 2)
            jump(true);
        else 
            jump(false);
    }
});

function play_eat_star(star)
{
    star.eat_time = last_time;
    eat_stars.push(star);
}

function is_collide(cx, cy, sprite)
{
    var w = sprite.width;
    var h = sprite.height;
    var xmin = cx + sprite.x - collide_radius;
    var xmax = cx + sprite.x + w + collide_radius;
    var ymin = cy + sprite.y - collide_radius;
    var ymax = cy + sprite.y + h + collide_radius;
    var sx = cat.x;
    var sy = cat.y;
    return sx > xmin && sx < xmax && sy > ymin && sy < ymax;
}

function add_object(ob)
{
    scene_obs.push(ob);
    stage.addChild(ob.get_render_ob());
}

function remove_object(ob)
{
    var idx = scene_obs.indexOf(ob);
    if (idx >= 0)
        scene_obs.splice(idx, 1);
    // ob.removed = true;
    // remove_obs.push(ob);
}

// A BrickLevel contains two line brick with a gap
class BrickLevel
{
    constructor(level, gap_size, gap_pos)
    {
        var container = new Container();
        var left_brick = new Sprite(resources[brick_line_image].texture); 
        var right_brick = new Sprite(resources[brick_line_image].texture); 
        container.addChild(left_brick);
        container.addChild(right_brick);
        left_brick.x = canvas_width / 2 - gap_size / 2 + gap_pos - left_brick.width;
        right_brick.x = canvas_width / 2 + gap_size / 2 + gap_pos;
        this.container = container;
        this.container.x = 0;
        this.left_brick = left_brick;
        this.right_brick = right_brick;
        this.level = level;
        this.x = 0;
        this.y = level * level_height;
    }

    get_render_ob()
    {
        return this.container;
    }

    update_collide()
    {
        var x = 0;
        var y = this.container.y;
        if (is_collide(x, y, this.left_brick) ||
            is_collide(x, y, this.right_brick))
            notify_game_over(); 
    }
}

// Star object, add score when collide
class Star
{
    constructor(level)
    {
        this.level = level;     
        this.sprite = new Sprite(resources[star_image].texture);
        this.sprite.anchor.set(0.5);
        this.sprite.pivot.set(0.5);
        this.x = canvas_width / 2 + rand1() * star_pos_info[0];
        this.y = level * level_height + star_pos_info[1] + rand1() * star_pos_info[2];
    }

    get_render_ob()
    {
        return this.sprite;
    }

    update_collide()
    {
        if (this.removed)
            return;

         if (is_collide(-this.sprite.width/2, -this.sprite.height/2, this.sprite))
         {
            notify_add_score();
            remove_object(this);
            play_eat_star(this.get_render_ob()); 
         }
    }
}

// Death box, dead when collide
class DeathBox
{
    constructor(level)
    {
        this.level = level;     
        this.sprite = new Sprite(resources[box_image].texture);
        this.sprite.anchor.set(0.5);
        this.x = canvas_width / 2 + rand1() * box_pos_info[0];
        this.y = level * level_height + box_pos_info[1] + rand1() * box_pos_info[2];
    }

    get_render_ob()
    {
        return this.sprite;        
    }

    update_collide()
    {
        if (is_collide(-this.sprite.width/2, -this.sprite.height/2, this.sprite))
            notify_game_over();
    }
}

function startup()
{
    loading_percent = 100;
    show_login_window();
    // show_rank_window();

    //Set the game state
    state = play;

    gameLoop();
}

function start_game() 
{
    clear_scene();
    camera_pos = 0;
    level_score = 0;
    star_score = 0;
    cur_level = 0;
    bricks = [];
    boxes = [];
    stars = [];
    op_list = [];
    scene_obs = [];
    remove_obs = [];
    eat_stars = [];
    start_time = Date.now();
    Math.seedrandom(start_time.toString());

    // Create background
    bg = new Sprite(resources[bg_image].texture);
    fill_sprite(bg);
    bg.interactive = true;
    stage.addChild(bg);

    // Create player
    cat = new Sprite(resources[player_image].texture);
    cat.anchor.set(0.5);
    cat.pivot.set(0.5);
    player_size = [cat.width, cat.height];
    player_radius = cat.width / 2;
    collide_radius = player_radius * collide_scale;
    px = born_pos[0];
    py = born_pos[1];
    cat.vx = 0;
    cat.vy = 0;
    stage.addChild(cat);

    // Create score
    score_label = createText("0", 60, '0x000000', canvas_width - 30, 30);
    score_label.anchor.set(1, 0);
    stage.addChild(score_label);

    // Build the first level
    build_scene(1);

    // Init last time & start the game loop
    last_time = Date.now();

    // Set game state
    game_state = "play";
}

function clear_scene() 
{
    for (var i = stage.children.length - 1; i >= 0; i--) {	
        stage.removeChild(stage.children[i]);
    };
}

function gameLoop()
{
    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

    //Update the current game state
    state();

    //Render the stage
    renderer.render(stage);
}

function jump(jmp_left)
{
    var op_time = Math.floor((last_time - start_time) / 10);
    op_list.push([op_time, jmp_left ? 1 : 0]);
    apply_speed(jmp_left ? - jmp_horz_speed : jmp_horz_speed, -jmp_vert_speed);
}

function apply_speed(x, y)
{
    cat.vx = x;
    cat.vy = y;
}

function create_button(name, x, y, func)
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

    stage.addChild(btn);
    stage.addChild(basicText);
    return btn;
}

function create_rect_box(width, height, color)
{
    var box = new PIXI.Graphics();
    box.beginFill(color);
    box.drawRect(0, 0, width, height);
    box.endFill();
    box.x = 0;
    box.y = 0;
    return box;
}

function show_login_window()
{
    clear_scene();
    game_state = "login";
    var login_bg = new Sprite(resources[login_bg_image].texture);
    fill_sprite(login_bg);
    stage.addChild(login_bg);

    var text = createText('寻找有趣的灵魂', 60, '0xffffff', canvas_width / 2, 500);
    text.anchor.set(0.5);
    stage.addChild(text);

    create_button("  排行榜 ", 100, canvas_height / 2, function() {
        console.log("排行榜");
        show_rank_window();
    });
    create_button("学生登录", canvas_width / 2 - 120, canvas_height / 2, function() {
        console.log("学生登陆");
        alert("Not supported");
    });
    create_button("游客登录", canvas_width - 350, canvas_height / 2, function() {
        console.log("游客登录");
        show_start_window();
    });

    text = createText('找有趣的灵魂·赢取万元大奖', 
            40, '0x444444', canvas_width / 2, canvas_height / 2 + 400);
    stage.addChild(text);

    var gift_interval = 50;
    var gift_x = 180;
    var height_off = -300;
    for (var i = 0; i < 5; i++)
    {
        var gift_bg = new Sprite(resources[gift_bg_image].texture);
        gift_bg.anchor.set(0.5);
        var gift_sprite = new Sprite(resources["images/gift1.png"].texture);
        gift_sprite.anchor.set(0.5);
        gift_bg.x = gift_x + i * (gift_sprite.width + gift_interval);
        gift_bg.y = canvas_height + height_off;
        gift_sprite.x = gift_x + i * (gift_sprite.width + gift_interval);
        gift_sprite.y = canvas_height + height_off;
        gift_sprite.scale.set(0.8);
        stage.addChild(gift_bg);
        stage.addChild(gift_sprite);
    }

    text.anchor.set(0.5);
    stage.addChild(text);
}

function show_start_window()
{
    game_state = "start";
    clear_scene();
    var start_bg = new Sprite(resources[start_bg_image].texture);
    fill_sprite(start_bg);
    start_bg.interactive = true;
    start_bg.on('pointerdown', function() {
        start_game();
    });
    stage.addChild(start_bg);
}

function show_rank_window()
{
    var rank_wnd = new RankWindow(canvas_width / 2, 200);
    rank_wnd.addItem(1, "shenyq", 103, true);
    rank_wnd.addItem(2, "liujj", 103, false);
    rank_wnd.addItem(3, "huangw", 103, false);
    rank_wnd.addItem(4, "xxx", 25, false);
    for (var i = 5; i <= 20; i++)
        rank_wnd.addItem(i, "sdf", i, false);
    rank_wnd.attachTo(stage);
}

function show_game_over_window()
{
    game_state = "game_over";
    clear_scene();
    var btn_retry = createButton(
            btn_retry_image, canvas_width / 2, canvas_height / 2 - 100, 
            function() {
                show_start_window();
            });
    btn_retry.scale.set(2);

    var btn_rank = createButton(
            btn_rank_image, canvas_width / 2, canvas_height / 2 + 100, 
            function() {
                show_rank_window();        
            });
    btn_rank.scale.set(2);

    console.log(op_list);
    stage.addChild(btn_retry);
    stage.addChild(btn_rank);
}

function notify_add_score()
{
    star_score++;
    update_score();
}

function player_dead()
{
    game_state = "dead";
    cat.die_time = Date.now();
    cat.die_dir = cat.x < canvas_width / 2 ? 1 : -1;
    cat.shake = 1;
}

function notify_game_over()
{
    player_dead();
    console.log("Game over!");
    var score = level_score + star_score;

    if (score > user_max_score)
    {
        console.log("scoe = {0}, max_score = {1}".format(score, user_max_score));

        // TODO: Connect to server and report the result
        if (score > report_scroe)
        {
            // TODO: Report some info for security
            var report_info = [score, cur_level, start_time, op_list];
        }
    }
}

// Update score
function update_score()
{
    var level_height_offset = -canvas_height / 2 + 200;
    var new_score = Math.floor((camera_pos + level_height_offset) / level_height);
    if (new_score > level_score)
        level_score = new_score;

    var score = level_score + star_score;
    score_label.text = score.toString();
}

function update_scene_obs()
{
    var new_level = Math.floor(camera_pos / level_height) + 1;
    if (new_level >= 2 && new_level > cur_level)
    {
         build_brick(new_level);
         build_star(new_level);
         build_box(new_level);
         cur_level = new_level;
    }

    for (var i = 0; i < scene_obs.length; i++)
    {
        var ob = scene_obs[i];
        var render_ob = ob.get_render_ob();
        var x = ob.x;
        var y = ob.y;
        y = camera_pos - y;
        render_ob.x = x;
        render_ob.y = Math.floor(y);
        ob.update_collide();
    }
}

function update_stars()
{
    var remove_num = 0;
    for (var i = 0; i < eat_stars.length; i++)
    {
        var star = eat_stars[i];
        var passed = last_time - star.eat_time;
        star.scale.set(Math.pow(1 + passed * 0.005, 1.2));
        star.alpha = (500 - passed) / 500.0;
        if (passed > 500)
        {
            remove_num ++;
            stage.removeChild(star);
        }
    }
    for (var i = 0; i < remove_num; i++)
        eat_stars.shift();
}

function update_player_death()
{
    if (game_state == "dead")
    {
        cat.vx = 2 * cat.die_dir;
        cat.vy = 2;

        cat.x += cat.vx * delta_time;
        cat.y += cat.vy * delta_time;
        cat.rotation += 200 * delta_time;

        var die_time = Date.now() - cat.die_time;

        if (die_time < 100)
            stage.scale.set(1.01 + cat.shake * 0.01);
        else
            stage.scale.set(1);

        cat.pivot.set(0.5);
        cat.shake = -cat.shake;

        if (die_time > 500)
            show_game_over_window();
    }
}

function update_player()
{
    // Update gravity & update player position
    cat.vy += gravity * delta_time * 0.001;

    px += cat.vx;
    py -= Math.floor(cat.vy);

    px = Math.max(player_size[0] / 2, px);
    px = Math.min(canvas_width - player_size[0] / 2, px);

    cat.x = px;
    var y = py;
    if (camera_pos > y)
    {
        y = camera_pos - y + canvas_height - camera_focus_pos;
        cat.y = y
    }
    else
    {
        camera_pos = py;
        cat.y = camera_focus_pos;
        update_score();
    }

    // Fall to the bottom of screen, game over
    if (py < camera_pos - camera_focus_pos)
        notify_game_over();
}

// Bring some sprites to topmost
function bring_to_topmost()
{
    stage.removeChild(score_label);
    stage.addChild(score_label);
}

function build_scene(level)
{
    build_brick(level);
    build_box(level);
    build_star(level);
}

function build_brick(level)
{
    // Change gap size by level
    var gap_size = gap_size_range[0] + (gap_size_range[1] - gap_size_range[0]) * Math.random();
    var max_change_scale = 0.25;
    var size_scale = 1 - Math.min(max_change_scale * level / 20, max_change_scale);
    gap_size *= size_scale;
    var gap_pos = rand1() * gap_pos_range;
    var brick_level = new BrickLevel(level, gap_size, gap_pos);
    add_object(brick_level);
    bring_to_topmost();
}

function build_box(level)
{
    var box = new DeathBox(level);
    add_object(box);
}

function build_star(level)
{
    var star = new Star(level);
    add_object(star);
}

function play() 
{
    var curTime = Date.now();
    delta_time = curTime - last_time;
    last_time = curTime;

    update_player_death();
    update_stars();

    if (game_state != "play")
        return;

    update_player();
    update_scene_obs();

    /*
    // Remove the obs need to be removed
    for (var i = 0; i < remove_obs.length; i++)
    {
        var ob = remove_obs[i];
        var idx = scene_obs.indexOf(ob);
        if (idx >= 0)
            scene_obs.splice(idx, 1);
    }*/
    remove_obs = [];

    // update_bricks();
    // update_boxes();
}

