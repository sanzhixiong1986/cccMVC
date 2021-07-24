# mvc设计- 网络模块设计

### 要点

- [三次握手](https://www.jianshu.com/p/acc9602f58a5)

- 断线从连

- 接口设计

  发送数据

  接受数据

------

EventMgr类的设计

```typescript
import { EventMgr } from ../EventMgr;

enum State {
  Disconnected = 0, 	//断开链接
  Connecting = 1,			//正在链接
  Connected = 2				//已经链接
}

export class NetMgr extends Component {
  public static Instance:NetMgr = null as unkown as NetMgr;
  private url:string = "ws://127.0.0.1:6081/ws";
  private state:number = State.Disconnected;
  private sock:WebSocket|null = null;
  
  onLoad():void{
    if(NetMgr.Instacnce === null){
      NetMgr.Instacne = this;
    }else{
      this.destory();
      return;
    }
    this.state = State.Disconnected;
  }
  
  public Init(url:string):void{
    this.url = url;
    this.state = State.Disconnected;
  }
  
  public send_data(data_arraybuf:ArrayBuffer){
    if(this.state === State.Connected && this.sock){
      this.sock.send(data_arraybuf);
    }
  }
  
  private connect_to_server():void
  {
    //是否已经链接到了	
    if(this.state !== State.Disconnected){
      return;
    }
    EventMgr.Instance.Emit("net_connectiong",null);
    
    //h5 websocket 操作
    this.state = State.Connecting;
    this.sock = new WebSocket(this.url);
    this.sock.biaryType = "arraybuffer";
    
    this.sock.onopen = this._on_opened.bind(this);
    this.sock.onmessage = this.on_recv_data.bind(this);
    this.sock.onclose = this._on_socket_close.bind(this);
    this.sock.onerror = this._on_socket_err.bind(this);
  }
  
  //收到数据
  private _on_recv_data(event:any){
    EventMgr.Instance.Emit("net_message",event.data);
  }
  
  //关闭
  private _on_socket_close(event:any){
    this.close_socket();
  }
  
  //错误
  private _on_socket_err(event:any){
    this.close_socket();
  }
  
  //关闭
  public close_socket(){
    if(this.state === State.Connected){
      if(this.sock !== null){
        this.sock.close();
        this.sock = null;
      }
    }
    EventMgr.Instance.Emit("net_disconnect",null);
    //修改状态
    this.state = State.Disconnected;
  }
  
  //链接成功
  private _on_opened(event:any){
    this.state = State.Connected;
    EventMgr.Instance.Emit("net_connect",null);
  }
  
  //断线从连
  update(dt:number){
    if(this.state !== State.Disconnected){
      return;
    }
    this.connect_to_server();
  }
}
```

------

