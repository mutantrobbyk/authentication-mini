import React from 'react'
import './App.css'
import axios from 'axios'

class App extends React.Component {
  state = {
    emailInput: '',
    passwordInput: '',
    user: {}
  }

  register() {
    axios.post('/api/register', {
      email: this.state.emailInput,
      password: this.state.passwordInput
    }).then(res => {
      this.setState({user: res.data.userData})
    })
  }

  login() {
    axios.post('/api/login', {
      email: this.state.emailInput,
      password: this.state.passwordInput
    }).then(res => {
      this.setState({user: res.data.userData})
    })
  }

  logout() {
    axios.get('/api/logout').then(res => {
      this.setState({user:res.data.userData})
      alert(res.data.message)
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Auth Mini</h1>
        <p>
          Email:
          <input onChange={e => this.setState({emailInput: e.target.value})} />
        </p>
        <p>
          Password: 
          <input onChange={e => this.setState({passwordInput: e.target.value})} />
        </p>
        <button onClick={() => this.register()}>Register</button>
        <button onClick={() => this.login()}>Login</button>
        <button onClick={() => this.logout()}>Logout</button>
        <hr/>
        <p>USER: {JSON.stringify(this.state.user)}</p>
      </div>
    )
  }
}

export default App
