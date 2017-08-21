
//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

var rank_window_image = "images/rank_window.png"
var rank_bg_image = "images/rank_bg.png"
var rank_mask_image = "images/rank_bg_mask.png"
var rank_item_image = "images/rank_item.jpg"
var btn_return_image = "images/btn_return.png"
var scroll_size = [850, 850];

class RankItem
{
    constructor()
    {
        // Item sprite
        this.sprite = new Sprite(resources[rank_item_image].texture);
        this.sprite.anchor.set(0,0);
    }

    setRank(rank, name, score, is_me)
    {
        var texty = 10;
        var rankx = 20;
        var namex = 160;
        var scorex = 700; 

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
        var scroll_wnd_sprite = new Sprite(resources[rank_bg_image].texture);
        var mask_sprite = new Sprite(resources[rank_mask_image].texture);
        this.scroll_window = new ScrollWindow(
                scroll_wnd_sprite, 
                mask_sprite, 
                window.width / 2 - scroll_size[0] / 2, 300, 
                scroll_size[0], scroll_size[1]);

        this.scroll_window.setItemInfo(40, 10);
        window.addChild(this.scroll_window.window);

        // Init my info
        this.initMyInfo();

        // Create buttons
        var ret_btn = createButton(btn_return_image, window.width / 2, window.height - 150,
            function(){
                stage.removeChild(window);
                console.log("返回...");
            }
        );
        ret_btn.scale.set(1.5);
        this.window.addChild(ret_btn);
    }

    initMyInfo()
    { 
        var rank_window = this;
        var myinfo = createText('', 40, '0xFFFFFF', 100, 200);
        this.window.addChild(myinfo);
        var login_as_user = !user_info.name || uesr_info.name.length == 0;

        if (!login_as_user)
            // Show tip
            myinfo.text = '未以学生身份登录，无法参与排行';
        else
            myinfo.text = "你的最高得分 : 正在查询"

        // Query rank info
        query_rank_info(function(rank_list) { 
            var my_rank = '未入榜';
            var my_score = 0;

            // Fill rank list
            for (var i = 0; i < rank_list.length; i++)
            {
                var rank_info = rank_list[i];
                var is_me = user_info.id == rank_info[0];
                if (is_me)
                {
                    my_rank = i+1;
                    my_score = rank_info[2];
                }
                rank_window.addItem(i+1, rank_info[1], rank_info[2], is_me);
            }
            
            if (login_as_user)
                // Update my info
                myinfo.text = '你的最高得分：{0}  排名：{1}'.format(my_score, my_rank);
        });
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }

    addItem(rank, name, score, is_me)
    {
        console.log("add item", name, score);
        var rank_item = new RankItem();
        rank_item.setRank(rank, name, score, is_me);
        this.scroll_window.addItem(rank_item.sprite, null);
    }
}

