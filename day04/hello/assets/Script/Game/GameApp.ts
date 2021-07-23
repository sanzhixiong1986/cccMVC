
import { _decorator, Component, Node , AudioClip} from 'cc';
import ResMgr from '../Framework/Mgr/ResMgr';

var resPkg = {
    "Sounds": [
        { assetType: cc.AudioClip, urls: 
            ["CK_attack1", 
            "Qinbing_die"
        ]},
    ]
}

export class GameApp extends cc.Component {
    public static Instance: GameApp = null as unknown as GameApp
    onLoad(): void {
        if(GameApp.Instance === null) {
            GameApp.Instance = this;
        }
        else {
            this.destroy();
            return;
        }
    }

    // 游戏逻辑入口
    public EnterGame(): void {
        console.log("Enter Game ....!",ResMgr.Instance);

        //加载成功
        // ResMgr.Instance.preloadResPkg(resPkg, (now: any, total: any)=>{
        //     console.log(now, total);
        // }, ()=>{
        //     this.EnterLoadingScene();
        // });
    }

    public EnterLoadingScene(): void {
        // 释放游戏地图
        // end

        // 释放游戏角色
        // end

        // 释放我们的游戏UI
        // end

        // 播放声音
        // var as = this.node.addComponent(cc.AudioSource);
        // as.clip = ResMgr.Instance.getAsset("Sounds", "CK_attack1");
        // as.loop = true;
        // as.play();
        // end
    }
    
}
