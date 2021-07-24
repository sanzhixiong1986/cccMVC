# mvc设计-声音管理模块

### 要点

- 添加N个AudioSource用来播放音效，我们用8个来
- 添加1个AudioSource作为播放音乐背景
- 提供播放背景音乐，音效
- 是否静音这些可以根据自己的需求扩展

------



```typescript
export class SoundMgr extends Component{
  public static Instance:SoundMgr = null as unkown as SoundMgr;
  private static MAX_SOUNDS = 8;//最大的数目
  private sounds:Array<AudioSource> = []; //装载所有的操作
  private bgMusic:AudioSource = null as numkown as AudioSource;
  private nowIndex = 0;
  private isMusicMute:boolean = false;
  private isSoundMute:boolean = false;
  onLoad(){
    if(SoundMgr.Instance === null){
      SoundMgr.Instance = this;
    }
    else{
      this.distory();
      return;
    }
    //添加8个音乐空间
    for(let i=0;i<SoundMgr.MAX_SOUNDS;i++){
      let as = this.node.addComponet(AudioSorce);
      this.sounds.push(as);
    }
    //end
    this.bgMusic = this.node.addComponent(AudioSorce) as AudioSource;
    //读取本地的声音缓存
    let value = localStorage.getItem("GAME_MUSIC_MUTE");
    if(value){
      let v = parseInt(value);
      this.isMusicMute =. (v===1)?true:false;
    }
    value = localStorage.getItem("GAME_SOUND_MUTE");
    if(value){
      let v = parseInt(value);
      this.isMusicMute =. (v===1)?true:false;
    }
    //end
  }
  
  //播放背景音乐
  public playBgMusic(clip:AudioClip,isLoop:boolean):void{
    this.bgMusic.clip = clip;
    this.bgMusic.loop = isLoop;
    this.bgMusic.volume = (this.isMusicMute)?0:1.0;
    this.bgMusic.play();
  }
  
  //关闭背景音乐
  public stopBgMusic():void{
    this.bgMusic.stop();
  }
  
  //播放音效
  public playSound(clip:AudioClip){
    if(this.isSoundMute === true){
      return;
    }
    let as = this.sounds[this.nowIndex];
    this.nowIndex ++;
    if(this.nowIndex>=SoundMgr.MAX_SOUNDS){
      this.nowIndex = 0;
    }
    as.clip = clip;
    as.loop = false;
    as.playOneShop(clip);
  }
  
  //设置声音
  public setMusicMute(isMute:boolean):void{
    this.isMusicMute = isMute;
    this.bgMusic.volume = (this.isMusicMute)?0:1.0;
    let value = (isMute)?1:0;
    localStorage.setItem("GAME_MUSIC_MUTE",value.toString());
  }
  
  public setSoundsMute(isMute:boobean){
    this.isSoundMute = isMute;
    let value = (isMute)?1:0;
    localStorage.setItem("GAME_SOUND_MUTE",value.toString());
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
      	var clip = ResMgr.Instance.getAsset("Sounds","CK_attack1");
      	SoundMgr.Instance.playBgMusic(clip,true);
        // end
    }
    
}

```

