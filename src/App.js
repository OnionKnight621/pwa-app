import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const localhostIp = `http://192.168.0.104:4567`;

class App extends Component {
  state = {
    items: [],
    loading: true,
    todoitem: ''
  };

  componentDidMount() {
    fetch(`${localhostIp}/items`)
      .then(response => response.json())
      .then(items => {
        this.setState({ items, loading: false })
      });
  }

  addItem = (e) => {
    e.preventDefault();

    fetch(`${localhostIp}/items`, {
      method: 'POST',
      body: JSON.stringify({ item: this.state.todoitem }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(items => {
        this.setState({ items })
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
        this.setState({ items })
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
        </nav>

        <div className="px-3 py-2">
          <form onSubmit={this.addItem} className="form-inline my-3">
            <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
              <input className='form-control col-12' placeholder="Add item" value={this.state.todoitem} onChange={(e) => this.setState({ todoitem: e.target.value })}  />
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
      </div>
    );
  }
}

export default App;
