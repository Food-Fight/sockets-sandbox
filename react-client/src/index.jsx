import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';

import axios from 'axios';

import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
      name: '',
      message:''
    }
    this.socket = io.connect(`${process.env.DOMAIN || 'http://localhost'}:${process.env.PORT || 5000}`);
    this.socket.on('chat', () => {
      this.fetch();
    });
  }

  componentDidMount() {
    this.fetch();
  }
  
  fetch() {
    let index = this;
    axios.get('/items')
    .then(function (results) {
      index.setState({
        items: results.data
      });
    }).catch(function (error) {
      console.log('Error:', error);
    });
  }

  sendMessage() {
    let index = this;
    console.log('THIS IS THE SOCKET', this.socket);
    this.socket.emit('chat', {
      name: this.state.name,
      message: this.state.message
    });
    axios.post('/items', {
      name: this.state.name,
      message: this.state.message
    })
    .then(function () {
      console.log('Message received!');
      index.fetch();
    }).catch(function (error) {
      console.log('Error:', error);
    });
  }

  updateName(e){
    this.setState({
      name: e.target.value,
    });
  }

  updateMessage(e){
    this.setState({
      message: e.target.value,
    });
  }

  render () {
    return (<div>
      <h3>Name</h3>
      <div><input type="text"
             value={this.state.name}
             onChange={this.updateName.bind(this)}></input></div>
      <h3>Message</h3>
      <div><input type="text"  
                  value={this.state.message}
                  onChange={this.updateMessage.bind(this)}></input></div>
      <button onClick={this.sendMessage.bind(this)}>Send</button>
      <h3>Messages</h3>
      <List items={this.state.items}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));