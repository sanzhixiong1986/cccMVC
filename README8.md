# mvc设计- 事件模块设计

### 要点

- 解决的问题

  统一管理事件模块

- 接口设计

  添加事件

  删除事件

  抛出事件

  接收事件

------

EventMgr类的设计

```typescript
export class EventMgr extends Component {

  public static Instance: EventMgr = null as unknown as EventMgr;
  // xxxx事件名字 ----》 【监听者1(caller, func)，监听者2...】
  private events_map: any = {};
  onLoad(): void {
    //单利模式
    if(EventMgr.Instance === null) {
      EventMgr.Instance = this;
    }
    else {
      this.destroy();
      return;
    }
  }

  // func(event_name: string, udata: any)
  public AddEventListener(eventName: string, caller: any, func: Function) {
    if (!this.events_map[eventName]) {
      this.events_map[eventName] = [];
    }
    var event_queue = this.events_map[eventName];
    event_queue.push({
      caller: caller,
      func: func
    });
  }

  //删除事件
  public RemoveListenner(eventName: string, caller: any, func: Function) {
    if (!this.events_map[eventName]) {
      return;
    }

    var event_queue = this.events_map[eventName];
    for(var i = 0; i < event_queue.length; i ++) {
      var obj = event_queue[i];
      if (obj.caller == caller && obj.func == func) {
        event_queue.splice(i, 1);
        break;
      }
    }
		//判断事件列表是否还有数据
    if (event_queue.length <= 0) {
      this.events_map[eventName] = null;
    }
  }
  //抛出事件
  public Emit(eventName: string, udata: any) {
    if (!this.events_map[eventName]) {
      return;
    }

    var event_queue = this.events_map[eventName];
    for(var i = 0; i < event_queue.length; i ++) {
      var obj = event_queue[i];
      obj.func.call(obj.caller, eventName, udata);
    }
  }
}

```

------



### 测试

```typescript

import { _decorator, Component, Node, AudioClip, AudioSource } from 'cc';
import { ResMgr } from '../Framework/Managers/ResMgr';
import { SoundMgr } from '../Framework/Managers/SoundMgr';

var resPkg = {
    "Sounds": [
        { assetType: AudioClip, urls: 
            ["CK_attack1", 
            "Qinbing_die"
        ]},
    ],
  	"GUI": [
        {
            assetType: Prefab, 
            urls: [
                "UIPrefabs/LoginUI",
            ],
        },
    ],

    // "Sounds": AudioClip,
}

export class GameApp extends Component {
    
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

        ResMgr.Instance.preloadResPkg(resPkg, (now: any, total: any)=>{
            console.log(now, total);
        }, ()=>{
            this.EnterLoadingScene();
        });
    }

    public EnterLoadingScene(): void {
        console.log("EnterLoadingScene");
        /*
        // 释放测试
        ResMgr.Instance.releaseResPkg(resPkg);

        this.scheduleOnce(()=>{
            console.log(ResMgr.Instance.getAsset("Sounds", "CK_attack1"));
        }, 3)*/
        
        // 释放游戏地图
        // end

        // 释放游戏角色
        // end

        // 释放我们的游戏UI
        // end

        // 播放声音
        /*var as = this.node.addComponent(AudioSource);
        as.clip = ResMgr.Instance.getAsset("Sounds", "CK_attack1");
        as.loop = true;
        as.play();
				*/
      	/*var clip = ResMgr.Instance.getAsset("Sounds","CK_attack1");
      	SoundMgr.Instance.playBgMusic(clip,true);*/
        // end
      UIMgr.Instance.ShowUIView("LoginUI");//显示ui
      
      // 监听事件
      EventMgr.Instance.AddEventListener("TestEvent", this, this.onEventCall);
      EventMgr.Instance.Emit("TestEvent", "joy zhou");
      EventMgr.Instance.RemoveListenner("TestEvent", this, this.onEventCall);
      // end
    }
  
  	private onEventCall(eventName: string, udata: any): void {
        console.log(udata);
    }
}

```

