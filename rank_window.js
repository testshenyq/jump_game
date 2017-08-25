
//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

var scroll_size = [566, 454];
class RankItem
{
    constructor()
    {
        // Item sprite
        this.sprite = new Sprite(resources[rank_item_image].texture);
        this.sprite.scale.set(1);
        this.sprite.anchor.set(0,0);
    }

    setRank(rank, name, score, is_me)
    {
        var texty = 20;
        var rankx = 20;
        var namex = 100;
        var scorex = 520; 

        // Rank
        var textStyle = {
            fontSize : 36,
            fill : '#000000',
        };
        var rankText = new PIXI.Text(rank.toString(), textStyle);
        rankText.x = rankx;
        rankText.y = texty;
        this.sprite.addChild(rankText);

        // Name
        var nameTextStyle = {
            fontSize : 36,
            fill : '#000000',
        };
        var nameText = new PIXI.Text(name, nameTextStyle);
        nameText.x = namex;
        nameText.y = texty;
        this.sprite.addChild(nameText);

        // Scroe
        var scoreTextStyle = {
            fontSize : 36,
            fill : '#000000',
        };
        var scoreText = new PIXI.Text(score.toString(), scoreTextStyle);
        scoreText.anchor.set(1,0);
        scoreText.x = scorex;
        scoreText.y = texty;
        this.sprite.addChild(scoreText);
    }
}

class RankWindow
{
    constructor(x, y)
    {
        // Create rank window sprite
        var window = new Sprite(resources[rank_window_image].texture);
        this.window = window;
        window.x = x - window.width / 2;
        window.y = y;
        stage.addChild(window);

        // Create scroll window
        var scroll_wnd_sprite = new Sprite(resources[scroll_bg_image].texture);
        var mask_sprite = new Sprite(resources[rank_mask_image].texture);
        this.scroll_window = new ScrollWindow(
                scroll_wnd_sprite, 
                mask_sprite, 
                window.width / 2 - scroll_size[0] / 2, 300, 
                scroll_size[0], scroll_size[1]);

        this.scroll_window.setItemInfo(10, 10);
        window.addChild(this.scroll_window.window);

        // Init my info
        this.initMyInfo();

        // Create buttons
        var btn_off = canvas_height * 0.12;
        var ret_btn = createButton(btn_return_image, window.width / 2, window.height - btn_off,
            function(){
                stage.removeChild(window);

                // Callback
                if (this.close)
                    this.close();

                console.log("返回...");
            }.bind(this)
        );
        this.window.addChild(ret_btn);
    }

    initMyInfo()
    { 
        var rank_window = this;
        var font_size = 25;
        var score_x = canvas_width * 0.4;
        var rank_x = canvas_width * 0.77;
        var label_y = canvas_height * 0.22;

        var label_score = createText('', font_size, '0x030303', score_x, label_y);
        var label_rank = createText('', font_size, '0x030303', rank_x, label_y);

        this.window.addChild(label_score);
        this.window.addChild(label_rank);

        // Get  current user id
        var id = user_info.id;

        if (!id)
            // Show tip
            label_score.text = '游客无法参与';
        else
            label_score.text = "正在查询"

        // Query rank info
        query_rank_info(id, function(my_rank, my_score, rank_list) { 
            if (my_rank <= 0)
                my_rank = "未上榜";

            // Fill rank list
            for (var i = 0; i < rank_list.length; i++)
            {
                var rank_info = rank_list[i];
                var is_me = user_info.id == rank_info[0];
                rank_window.addItem(i+1, rank_info[1], rank_info[2], is_me);
            }
            
            if (id)
            {
                // Update my info
                label_score.text = my_score.toString();
                label_rank.text = my_rank.toString();
                user_info.max_score = my_score;
            }
        });
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }

    addItem(rank, name, score, is_me)
    {
        var rank_item = new RankItem();
        rank_item.setRank(rank, name, score, is_me);
        this.scroll_window.addItem(rank_item.sprite, null);
    }
}

