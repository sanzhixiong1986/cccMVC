
import { _decorator, Component, Node } from 'cc';
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
        console.log("Enter Game ....!");

        this.EnterLoadingScene();
        // this.EnterLoginScene();
    }

    public EnterLoadingScene(): void {
        // 释放游戏地图
        // end

        // 释放游戏角色
        // end

        // 释放我们的游戏UI
        // end
    }
    
}
