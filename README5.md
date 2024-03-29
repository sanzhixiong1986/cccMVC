# mvc设计-定时器

### 要点

- 方便管理程序中的所有定时器

------



```typescript
class TimerNode {
    public callback: Function = null as unknown as Function;
    public duration: number = 0; // 定时器触发的时间间隔;
    public delay: number = 0; // 第一次触发要隔多少时间;
    public repeat: number = 0; // 你要触发的次数;
    public passedTime: number = 0; // 这个Timer过去的时间;
    public param: any = null; // // 用户要传的参数
    public isRemoved: boolean = false; // 是否已经删除了
    public timerId: number = 0; // 标识这个timer的唯一Id号;
}

export class TimerMgr extends Component {
    public static Instance: TimerMgr = null as unknown as TimerMgr;
    
    private autoIncId: number = 1; // 自增长的id, 表示唯一的timerId;
    private timers: any = {}; // 这个timerId--->Timer对象隐映射
    private removeTimers:  Array<TimerNode> = [];
    private newAddTimers:  Array<TimerNode> = [];

    onLoad(): void {
        if(TimerMgr.Instance === null) {
            TimerMgr.Instance = this;
        }
        else {
            this.destroy();
            return;
        }
    }

    update(dt: number): void {
        // 把新加进来的放入到我们的表里面来
        for (let i = 0; i < this.newAddTimers.length; i++) {
            this.timers[this.newAddTimers[i].timerId] = this.newAddTimers[i];
        }
        this.newAddTimers.length = 0;
        // end

        for (let key in this.timers) {
            var timer = this.timers[key];
            if (timer.isRemoved) {
                this.removeTimers.push(timer);
                continue;
            }

            timer.passedTime += dt; // 更新一下timer时间
            if (timer.passedTime >= (timer.delay + timer.duration)) {
                // 做一次触发
                timer.callback(timer.param);
                timer.repeat--;
                timer.passedTime -= (timer.delay + timer.duration);
                timer.delay = 0; // 很重要;

                if (timer.repeat == 0)
                { // 触发次数结束，我们是不是要删除这个Timer; 
                    timer.isRemoved = true;
                    this.removeTimers.push(timer);
                }
                // end 
            }
        }

        // 结束以后，清理掉要删除的Timer;
        for (let i = 0; i < this.removeTimers.length; i++) {
            // this.timers.delete(this.removeTimers[i]);
            delete this.timers[this.removeTimers[i].timerId];
        }
        this.removeTimers.length = 0;
        // end
    }

    // [repeat < 0 or repeat == 0 表示的是无限触发]
    public ScheduleWithParams(func: Function, param: any, repeat: number, duration: number, delay: number = 0): number
    {
        let timer: TimerNode = new TimerNode();
        timer.callback = func;
        timer.param = param;
        timer.repeat = repeat;
        timer.duration = duration;
        timer.delay = delay;
        timer.passedTime = timer.duration;
        timer.isRemoved = false;

        timer.timerId = this.autoIncId;
        this.autoIncId ++;

        // this.timers.Add(timer.timerId, timer);
        this.newAddTimers.push(timer);

        return timer.timerId;
    }

    public Once(func: Function, delay: number): number
    {
        return this.Schedule(func, 1, 0, delay);
    }

    public ScheduleOnce(func: Function, param: any, delay: number): number {
        return this.ScheduleWithParams(func, param, 1, 0, delay);
    }

    // [repeat < 0 or repeat == 0 表示的是无限触发]
    public Schedule(func: Function, repeat: number, duration: number, delay: number = 0): number
    {
        return this.ScheduleWithParams(func, null, repeat, duration, delay);
    }

  public Unschedule(timerId: number) {
    if (!this.timers[timerId]) {
      return;
    }

    let timer: TimerNode = this.timers[timerId];
    timer.isRemoved = true;
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
    ]

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
      	//var clip = ResMgr.Instance.getAsset("Sounds","CK_attack1");
      	//SoundMgr.Instance.playBgMusic(clip,true);
        // end
      var timerId = TimerMgr.Instance.ScheduleWithParams((data: any)=>{
            console.log("timer test", data);
        }, "joy", 0, 0.5, 3);


        TimerMgr.Instance.Once(()=>{
            TimerMgr.Instance.Unschedule(timerId);
        }, 10);
    }
}

```

