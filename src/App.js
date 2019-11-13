import React, { Component } from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import profileLogo from './default_avatar.png'

const localhostIp = `http://192.168.0.104:4567`;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4-base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/")

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  };

  return outputArray;
}

class Profile extends Component {

  state = {
    image: null,
    supportCamera: 'mediaDevices' in navigator
  }

  changeImage = (e) => {
    this.setState({
      image: URL.createObjectURL(e.target.files[0])
    })
  }

  startChangeImage = () => {
    this.setState({
      enableCamera: !this.state.enableCamera
    })
  }

  takeImage = () => {
    this._canvas.width = this._video.videoWidth;
    this._canvas.height = this._video.videoHeight;

    this._canvas.getContext('2d').drawImage(
      this._video,
      0, 0,
      this._video.videoWidth,
      this._video.videoHeight
    )

    this._video.srcObject.getVideoTracks().forEach(track => {
      track.stop()
    })

    this.setState({
      image: this._canvas.toDataURL(),
      enableCamera: false
    })
  }

  subscribe = () => {
    const publKey = 'BPaTO6-eFBDImqHM_w_mIY-OM0JSTbINffuxIaFyCdzc6p9-p2s1cQ2OH9nfStTv7Fk682EK8Spuq4ZRt-R39GA'
    const privateKey = 'GUF51nFS_EhEiR7JgG2PKi94TKPuqRIpA7k55JyXK_I'

    global.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(publKey)
    }).then(sub => {
      console.log('Subscribed')
    }).catch(err => {
      console.log('Error on subscription ', err)
    })
  }

  pushMessage = () => {
    global.registration.showNotification('Pushed', {
      body: 'Pushed'
    })
  }

  render () {
    return (
      <div>
        <nav className="navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">
            <Link to="/">
              <img src={logo} alt="logo"/>
            </Link>
            Profile
          </span>
        </nav>
  
        <div style={{textAlign: 'center'}}>
          <img src={this.state.image || profileLogo} alt="profile" style={{height: 200, marginTop: 50}}/>
          <p style={{color: '#888', fontSize: 20}}>username</p>

          {
            this.state.enableCamera && 
            <div>
              <video ref={c => {
                this._video = c;
                if (this._video) {
                  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => this._video.srcObject = stream)
                }
              }} controls={false} autoPlay style={{width: '100%', maxWidth: 300}}></video>
            </div>
          }

          <br/>
          <input type="file" accept="image/*" name="photo" id="phto" onChange={this.changeImage} capture="user  " />

          {
            this.state.supportCamera &&
            <div>
              <button onClick={this.startChangeImage}>Toggle camera</button>
              <br/>
              <button onClick={this.takeImage}>
                take image
              </button>
              <canvas ref={c => this._canvas = c} style={{display: 'none'}} />
            </div>
          }

          <br/>
          <button onClick={this.subscribe}>Subscribe for notifications</button>

          <br/>
          <button onClick={this.pushMessage }>Push</button>

        </div>
      </div>
    )
  }
}

class List extends Component {
  state = {
    items: [],
    loading: true,
    item: '',
    offline: !navigator.onLine
  };

  componentDidMount() {
    fetch(`${localhostIp}/items`)
      .then(response => response.json())
      .then(items => {
        this.setState({ items, loading: false })
      });

    window.addEventListener('online', this.setOfflineMode);
    window.addEventListener('offline', this.setOfflineMode);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setOfflineMode);
    window.removeEventListener('offline', this.setOfflineMode);
  }

  setOfflineMode = () => {
    this.setState({ offline: !navigator.onLine})
  }

  addItem = (e) => {
    e.preventDefault();

    fetch(`${localhostIp}/items`, {
      method: 'POST',
      body: JSON.stringify({ item: this.state.item }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(items => {
        if (items.error) {
          alert(items.error)
        } else {
          this.setState({ items })
        }
      });
    
    this.setState({ todoitem: '' });
  }

  deleteItem = (itemid) => {
    fetch(`${localhostIp}/item`, {
      method: 'DELETE',
      body: JSON.stringify({ id: itemid }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(items => {
        if (items.error) {
          alert(items.error)
        } else {
          this.setState({ items })
        }
      });
  }

  render() {
    return (
      <div className="App">
        <nav className='navbar navbar-light bg-light'>
          <span className="navbar-brand mb-0 h1">
            <img src={logo} alt="logo" className="App-logo" width="50%" height="50%"/>
            Items list
          </span>

          {
            this.state.offline &&
            <span className="badge badge-danger my-3">
              offline
            </span>
          }

          <span>
            <Link to="/profile">Profile</Link>
          </span>
        </nav>

        <div className="px-3 py-2">
          <form onSubmit={this.addItem} className="form-inline my-3">
            <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
              <input className='form-control col-12' placeholder="Add item" value={this.state.item} onChange={(e) => this.setState({ item: e.target.value })}  />
            </div>
            <button type="submit" className="btn btn-primary mb-2 col-4 col-sm-2">Add</button>
          </form>

          { this.state.loading && <p>Loading...</p> }

          {
            !this.state.loading && this.state.items.length === 0 &&
            <div className="alert alert-secondary">No items</div>
          }

          {
            !this.state.loading && this.state.items && 
            <table className="table table-striped">
              <tbody>
                {
                  this.state.items.map((item, i) => {
                    return (
                      <tr key={item.id} className='row'>
                        <td className="col-1">{i+1}</td>
                        <td className="col-9">{item.item}</td>
                        <td className="col-2">
                          <button className="close" aria-label="close" onClick={() => this.deleteItem(item.id)}>
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          }
        </div>

        <button class="add-button">Add to home screen</button>
      </div>
    );
  }
}

export default () => 
  <BrowserRouter>
  <div>
    <Route path="/" exact component={List}/>
    <Route path="/profile" exact component={Profile}/>
  </div>
  </BrowserRouter>
