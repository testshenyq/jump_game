

//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

var player_image = "images/players/player.png";
var bg_image = "images/bg_sky.jpg"
var login_bg_image = "images/login_bg.jpg"
var start_bg_image = "images/start_bg.jpg"
var scroll_bg_image = "images/transparent.png"
var rank_mask_image = "images/white.jpg"
var rank_window_image = "images/rank_wnd.jpg"
var rank_item_image = "images/rank_item.png"
var btn_ok_image = "images/btn_ok.png"
var btn_return_image = "images/btn_return.png"
var btn_retry_image = "images/btn_retry.png"
var brick_line_image = "images/brick_level.jpg"
var box_image = "images/box1.png"
var box2_image = "images/box2.png"
var star_image = "images/star2.png"
var loading_image = "images/black_bg.jpg"
var game_over_image = "images/game_over.png"
var alpha_bg_image = "images/alpha_bg.png"
var register_wnd_image = "images/register_wnd.jpg"
var gift_wnd_image = "images/gift_wnd.jpg"
var time_image = "images/count_down.png"

var btn_enter_game_image = "images/btn_enter_game.png"
var btn_gift_image = "images/btn_gift.png"
var btn_rank_image = "images/btn_rank.png"
var btn_menu_image = "images/btn_main_menu.png"
var btn_student_image = "images/btn_student.png"

var res_list = [
    player_image,
    bg_image,
    login_bg_image,
    start_bg_image,
    scroll_bg_image,
    rank_item_image,
    rank_mask_image,
    rank_window_image,
    btn_ok_image,
    btn_return_image,
    btn_retry_image,
    brick_line_image,
    box_image,
    box2_image,
    star_image,
    game_over_image,
    alpha_bg_image,
    register_wnd_image,
    gift_wnd_image,
    time_image,
    btn_enter_game_image,
    btn_gift_image,
    btn_rank_image,
    btn_menu_image,
    btn_student_image,
];

var box_images = [
    box_image,
    box2_image,
];

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

    // Load all resource in res list
    loader.progress = 0;
    for (var i = 0; i < res_list.length; i++)
        loader.add(res_list[i]);

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
var jmp_horz_speed = 150;
var jmp_vert_speed = 550;
var gravity = 1000;
var level_height = 600;
var gap_size_range = [canvas_width * 0.45, canvas_width * 0.55];
var gap_pos_range = canvas_width * 0.185;
var box_pos_info = [
    [canvas_width * 0.185, canvas_height * 0.42, canvas_height * 0.026],
    [canvas_width * 0.22, canvas_height * 0.25, canvas_height * 0.035],
];
var star_pos_info = [
    [canvas_width * 0.14, canvas_height * 0.252, canvas_height * 0.052],
    [canvas_width * 0.2, canvas_height * 0.15, canvas_height * 0.08]
];
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
var time_label;
var time_sprite;
var count_down;
var total_time = 60;
var game_state = "login";
var bricks;
var boxes;
var stars;
var scene_obs = [];
var eat_stars = [];
var remove_obs = [];

// Security
var need_extra_report_score = 40;
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
document.body.appendChild(renderer.view);
renderer.view.style.position = 'absolute';
renderer.view.style.left = '50%';
renderer.view.style.top = '50%';
renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
document.body.appendChild(renderer.view);
resize();

// Create default input element
var global_input = document.getElementById("global_input");
global_input.tabindex = -1;

document.body.appendChild(global_input);

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

// Update collide dir
function calc_collide_dir(x, y, xmin, xmax, ymin, ymax)
{
    var dx = 1, dy = 1;
    var min = 100;
    var left = x - xmin;
    var threshold = 24;
    if (x - xmin < threshold || xmax - x < threshold)
        dx = -1;
    
    if (y - ymin < threshold || ymax - y < threshold)
        dy = -1;
        
    return [dx, dy];
}

// Check collide by sprite
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
    if (sx > xmin && sx < xmax && sy > ymin && sy < ymax)
    {
        cat.collide_dir = calc_collide_dir(sx, sy, xmin, xmax, ymin, ymax);
        return true;
    }
    return false;
}

function add_object(ob)
{
    scene_obs.push(ob);
    stage.addChild(ob.get_render_ob());
}

function add_to_remove_list(ob, remove_render)
{
    ob.removed = true;
    ob.remove_render = remove_render;
    remove_obs.push(ob);
}

function remove_object(ob)
{
    var idx = scene_obs.indexOf(ob);
    if (idx >= 0)
        scene_obs.splice(idx, 1);
    if (ob.remove_render)
        stage.removeChild(ob.get_render_ob());
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

    update()
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
    constructor(level, idx)
    {
        this.level = level;     
        this.sprite = new Sprite(resources[star_image].texture);
        this.sprite.anchor.set(0.5);
        this.sprite.pivot.set(0.5);
        this.x = canvas_width / 2 + rand1() * star_pos_info[idx][0];
        this.y = level * level_height + star_pos_info[idx][1] + rand1() * star_pos_info[idx][2];
    }

    get_render_ob()
    {
        return this.sprite;
    }

    update()
    {
        if (this.removed)
            return;

         if (is_collide(-this.sprite.width/2, -this.sprite.height/2, this.sprite))
         {
              cat.collide_dir[0] = 0;
              cat.collide_dir[1] = 0;
              notify_add_score();
              add_to_remove_list(this, false);
              play_eat_star(this.get_render_ob()); 
         }
    }
}

// Death box, dead when collide
class DeathBox
{
    constructor(level, idx)
    {
        this.level = level;     
        this.sprite = new Sprite(resources[box_image].texture);
        this.sprite.anchor.set(0.5);
        this.x = canvas_width / 2 + rand1() * box_pos_info[idx][0];
        this.y = level * level_height + box_pos_info[idx][1] + rand1() * box_pos_info[idx][2];
    }

    get_render_ob()
    {
        return this.sprite;        
    }

    update()
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
    count_down = total_time;
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
    cat.collide_dir = [0,0];
    player_size = [cat.width, cat.height];
    player_radius = cat.width / 2;
    collide_radius = player_radius * collide_scale;
    px = born_pos[0];
    py = born_pos[1];
    cat.vx = 0;
    cat.vy = 0;
    stage.addChild(cat);

    // Create score label
    score_label = createText("0", 65, '0x080808', canvas_width / 2, 60);
    score_label.anchor.set(0.5);
    stage.addChild(score_label);

    // Create count down label
    time_sprite = new Sprite(resources[time_image].texture);
    time_sprite.x = 30;
    time_sprite.y = 40;
    time_sprite.anchor.set(0.5);
    stage.addChild(time_sprite);
    time_label = createText(count_down.toString(), 40, '0x080808', 60, 40);
    time_label.anchor.set(0, 0.5);
    stage.addChild(time_label);

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
    op_list.push((op_time << 1) + (jmp_left ? 1 : 0));
    apply_speed(jmp_left ? - jmp_horz_speed : jmp_horz_speed, -jmp_vert_speed);
}

function apply_speed(x, y)
{
    cat.vx = x;
    cat.vy = y;
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
    var window = new LoginWindow();
    window.attachTo(stage);
}

function show_gift_window()
{
    // Create bg sprite
    var bg = new Sprite(resources[gift_wnd_image].texture);
    bg.interactive = true;
    fill_sprite(bg);
    stage.addChild(bg);

    // Create button
    create_button(bg, btn_return_image, 1,
        canvas_width / 2, canvas_height * 0.9,
        function() {
            stage.removeChild(bg);
        }
    );
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
    var rank_wnd = new RankWindow(canvas_width / 2, 0);
    rank_wnd.attachTo(stage);
}

function show_register_window()
{
    var reg_wnd = new RegisterWindow(canvas_width / 2, 0);
    reg_wnd.attachTo(stage);
}

function show_game_over_window()
{
    game_state = "game_over";

    var bg = new Sprite(resources[alpha_bg_image].texture);
    bg.interactive = true;
    stage.addChild(bg);
    fill_sprite(bg);

    var game_over = new Sprite(resources[game_over_image].texture);
    game_over.anchor.set(0.5);
    game_over.x = canvas_width / 2;
    game_over.y = canvas_height * 0.3;
    stage.addChild(game_over);

    var btn_retry = createButton(
            btn_retry_image, canvas_width / 2, canvas_height * (0.6 - 0.1), 
            function() {
                show_start_window();
            });

    var btn_rank = createButton(
            btn_rank_image, canvas_width / 2, canvas_height * (0.6), 
            function() {
                show_rank_window();        
            });

    var btn_menu = createButton(
            btn_menu_image, canvas_width / 2, canvas_height * (0.6 + 0.1), 
            function() {
                show_login_window();
            });

    stage.addChild(btn_retry);
    stage.addChild(btn_rank);
    stage.addChild(btn_menu);
}

function notify_add_score()
{
    star_score++;
    update_score(true);
}

function player_dead()
{
    game_state = "dead";
    console.log("collide dir = ", cat.collide_dir);

    // Change velocity
    cat.vx = cat.vx * cat.collide_dir[0];
    cat.vy = cat.vy * cat.collide_dir[1];

    // Record die time
    cat.die_time = Date.now();

    if (count_down > 0)
        cat.shake = 1;
}

function notify_game_over()
{
    player_dead();
    console.log("Game over!");
    var score = level_score + star_score;

    if (score > user_info.max_score && user_info.id)
    {
        var extra_info = null;

        // Need to report op list when score is high enough
        if (score > need_extra_report_score)
            extra_info = [cur_level, start_time, op_list];

        // Report score info to server
        report_score(user_info.id, score, extra_info, function(result, reason) {

            if (result)
                // 更新最高分
                user_info.max_score = score;
            else
                message_box("上报最新分数失败");
        });
    }
}

// Update time label
function update_time(cd)
{
    count_down = cd;
    time_label.text = count_down.toString();
}

// Update score label
function update_score(force)
{
    var level_height_offset = -canvas_height / 2;
    var new_score = Math.floor((camera_pos + level_height_offset) / level_height);
    if (new_score > level_score || force)
    {
        level_score = new_score;
        var score = level_score + star_score;
        score_label.text = score.toString();
        console.log(scene_obs.length, stage.children.length);
    }
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
        if (ob.removed)
            continue;

        var render_ob = ob.get_render_ob();
        var x = ob.x;
        var y = ob.y;
        y = camera_pos - y;
        render_ob.x = x;
        render_ob.y = Math.floor(y);
        ob.update();

        // Out of screen, remove it
        if (!ob.removed && y > canvas_height * 1.2)
            add_to_remove_list(ob, true);
    }

    if (remove_obs.length > 0)
    {
        console.log("remove", remove_obs.length);
        for (var i = 0; i < remove_obs.length; i++)
            remove_object(remove_obs[i]);
        remove_obs.length = 0;
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
        if (count_down == 0)
        {
            show_game_over_window();
            return;
        }

        cat.x += cat.vx * delta_time * 0.003;
        cat.y += cat.vy * delta_time * 0.003;
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

    px += Math.floor(cat.vx * delta_time * 0.001);
    py -= Math.floor(cat.vy * delta_time * 0.001);

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
        update_score(false);
    }

    // Fall to the bottom of screen, game over
    if (py < camera_pos - camera_focus_pos)
        notify_game_over();
}

function bring_object_topmost(ob)
{
    stage.removeChild(ob);
    stage.addChild(ob);
}

// Bring some objects to topmost
function bring_to_topmost()
{
    bring_object_topmost(score_label);
    bring_object_topmost(time_label);
    bring_object_topmost(time_sprite);
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
    // Refresh some boxes
    var num = 1;
    if (level > 20)
        num = 2;
    else if (level > 10)
    {
        if (Math.random() < (level - 10) * 0.1)
            num = 2;
    }

    for (var i = 0; i < num; i++)
    {
        var box = new DeathBox(level, i);
        add_object(box);
    }
}

function build_star(level)
{
    // Refresh some stars
    var num = 1;
    if (level > 20)
        num = 2;
    else if (level > 10)
    {
        if (Math.random() < (level - 10) * 0.1)
            num = 2;
    }

    for (var i = 0; i< num; i++)
    {
        var star = new Star(level, i);
        add_object(star);
    }
}

function play() 
{
    var cur_time = Date.now();
    delta_time = cur_time - last_time;
    last_time = cur_time;

    update_player_death();
    update_stars();

    if (game_state != "play")
        return;

    var cd = total_time - Math.floor((cur_time - start_time) / 1000);
    if (cd != count_down)
        update_time(cd);

    update_player();
    update_scene_obs();

    if (cd <= 0)
        notify_game_over();

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

