
import { _decorator, Component, Node } from 'cc';
import { EventMgr } from './Framework/Managers/EventMgr';
import { ResMgr } from './Framework/Managers/ResMgr';
import { SoundMgr } from './Framework/Managers/SoundMgr';
import { TimerMgr } from './Framework/Managers/TimerMgr';
import { UIMgr } from './Framework/Managers/UIMgr';
import { GameApp } from './Game/GameApp';
const { ccclass } = _decorator;

@ccclass('GameLanch')
export class GameLanch extends Component {
    
    onLoad(): void {
        console.log("Game Lanching......");
        // 初始化框架逻辑: 资源管理，声音管理，网络管理
        this.node.addComponent(ResMgr);
        this.node.addComponent(SoundMgr);
        this.node.addComponent(TimerMgr);
        this.node.addComponent(EventMgr);
        this.node.addComponent(UIMgr);

        this.node.addComponent(GameApp);
        // end 

        // 检查更新我们的资源
        // end

        // 进入游戏里面去
        GameApp.Instance.EnterGame();
        // end
    }
}


