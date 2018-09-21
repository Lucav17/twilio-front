import React, { Component } from "react";
import CONFIG from '../configs/main';
import Axios from 'axios';
import { setJWTCookie } from '../utils/Session';
import '../assets/auth.css'

class Login extends Component {

    handleClick() {
        let email = document.getElementById('email').value,
            pass = document.getElementById('pass').value;

        if(!email || !pass) {
            alert('Please enter all fields')
        } else {
          const body = {
            email: email,
            password: pass,
          };

          const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
            Axios.post(`${CONFIG.BASE_URL}/auth/login`, body, config)
            .then((res) => {
              if(res.status === 200) {
                setJWTCookie(res.data.token);
                window.location.href = '/account/dashboard';
              } else {
                alert('Please try again');
              }
            }).catch(e => {
              alert(e);
            })
        }
    }
  render() {
    return (
      <div className="auth-container">
        <div className="container">
          <div className="row" />
          <div className="col-sm-6 offset-sm-3">
            <div className="auth-card">
              <h3>Log into your account</h3>
              <div className="field-holder">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                    <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    id='email'
                    type="email"
                    style={{borderLeft:"none"}}
                    className="form-control"
                    placeholder="Email Address"
                  />
                  
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                    <i className="fas fa-unlock"></i>
                    </span>
                  </div>
                  <input
                    id='pass'
                    type="password"
                    style={{borderLeft:"none"}}
                    className="form-control"
                    placeholder="Password"
                  />
                  
                </div>

                <button type='button' onClick={this.handleClick} className='btn btn-primary'>Log in</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
