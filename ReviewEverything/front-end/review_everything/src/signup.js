import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = { username: '', fname: '', lname: '', street: '', city: '', stateVal: 'UT', zip: '', email: '', password: '', phone: '', redirect: null };
    this.changeUName = this.changeUName.bind(this);
    this.changeFName = this.changeFName.bind(this);
    this.changeLName = this.changeLName.bind(this);
    this.changeStreet = this.changeStreet.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeZip = this.changeZip.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.submitInfo = this.submitInfo.bind(this);
    this.login = this.login.bind(this);
  }
  
  login() {
    this.setState({ redirect: '/' });
  }
  
  changeUName(event) {
    this.setState({username : event.target.value})
  }
  
  changeFName(event) {
    this.setState({fname : event.target.value})
  }

  changeLName(event) {
    this.setState({lname : event.target.value})
  }

  changeStreet(event) {
    this.setState({street : event.target.value})
  }

  changeCity(event) {
    this.setState({city : event.target.value})
  }

  changeState(event) {
    this.setState({stateVal : event.target.value})
  }

  changeZip(event) {
    this.setState({zip : event.target.value})
  }

  changeEmail(event) {
    this.setState({email : event.target.value})
  }

  changePassword(event) {
    this.setState({password : event.target.value})
  }

  changePhone(event) {
    this.setState({phone : event.target.value})
  }
  
  submitInfo(event) {
    event.preventDefault();

    const data = { username: this.state.username, fname: this.state.fname, lname: this.state.lname, street: this.state.street, city: this.state.city, state: this.state.stateVal, zip_code: this.state.zip, email: this.state.email, password: this.state.password, phone: this.state.phone };
  
    fetch('http://localhost:9000/test/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        if (json.error_check === true) {
          console.log(json.message);
          alert(json.message);
        }
        else {
          cookies.set('currentUser', JSON.stringify(json.user), {path: '/'});
          this.setState({redirect: '/home'});
        }
      })
  }
  
  componentDidMount() {
    if(!cookies.get('currentUser')) {
      console.log('No cookie exists. Login or signup to create your cookie.');
    } else {
      this.setState({ redirect: '/home' });
    }
  }
  
  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    return(
      <div className='signup-display'>
        <div className='signup-header'>
          <h1>Sign Up</h1>
        </div>
        <div className='signup-form'>
          <form onSubmit={ this.submitInfo }>
            <label>Username: <input className='signup-input' type='text' placeholder='Username here...' value={this.state.username} onChange={ this.changeUName }></input></label><br/>
            <label>First Name: <input className='signup-input' type='text' placeholder='First name here...' value={this.state.fname} onChange={ this.changeFName }></input></label><br/>
            <label>Last Name: <input className='signup-input' type='text' placeholder='Last name here...' value={this.state.lname} onChange={ this.changeLName }></input></label><br/>
            <label>Street Address: <input className='signup-input' type='text' placeholder='Street address here...' value={this.state.street} onChange={ this.changeStreet }></input></label><br/>
            <label>City: <input className='signup-input' type='text' placeholder='City here...' value={this.state.city} onChange={ this.changeCity }></input></label><br/>
            <label>State: <select className='signup-input' value={this.state.stateVal} onChange={ this.changeState }>
                <option value='AL'>Alabama(AL)</option>
                <option value='AK'>Alaska(AK)</option>
                <option value='AZ'>Arizona(AZ)</option>
                <option value='AR'>Arkansas(AR)</option>
                <option value='CA'>California(CA)</option>
                <option value='CO'>Colorado(CO)</option>
                <option value='CT'>Connecticut(CT)</option>
                <option value='DE'>Delaware(DE)</option>
                <option value='FL'>Florida(FL)</option>
                <option value='GA'>Georgia(GA)</option>
                <option value='HI'>Hawaii(HI)</option>
                <option value='ID'>Idaho(ID)</option>
                <option value='IL'>Illinois(IL)</option>
                <option value='IN'>Indiana(IN)</option>
                <option value='IA'>Iowa(IA)</option>
                <option value='KS'>Kansas(KS)</option>
                <option value='KY'>Kentucky(KY)</option>
                <option value='LA'>Louisiana(LA)</option>
                <option value='ME'>Maine(ME)</option>
                <option value='MD'>Maryland(MD)</option>
                <option value='MA'>Massachusetts(MA)</option>
                <option value='MI'>Michigan(MI)</option>
                <option value='MN'>Minnesota(MN)</option>
                <option value='MS'>Mississippi(MS)</option>
                <option value='MO'>Missouri(MO)</option>
                <option value='MT'>Montana(MT)</option>
                <option value='NE'>Nebraska(NE)</option>
                <option value='NV'>Nevada(NV)</option>
                <option value='NH'>New Hampshire(NH)</option>
                <option value='NJ'>New Jersey(NJ)</option>
                <option value='NM'>New Mexico(NM)</option>
                <option value='NY'>New York(NY)</option>
                <option value='NC'>North Carolina(NC)</option>
                <option value='ND'>North Dakota(ND)</option>
                <option value='OH'>Ohio(OH)</option>
                <option value='OK'>Oklahoma(OK)</option>
                <option value='OR'>Oregon(OR)</option>
                <option value='PA'>Pennsylvania(PA)</option>
                <option value='RI'>Rhode Island(RI)</option>
                <option value='SC'>South Carolina(SC)</option>
                <option value='SD'>South Dakota(SD)</option>
                <option value='TN'>Tennessee(TN)</option>
                <option value='TX'>Texas(TX)</option>
                <option value='UT'>Utah(UT)</option>
                <option value='VT'>Vermont(VT)</option>
                <option value='VA'>Virgina(VA)</option>
                <option value='WA'>Washington(WA)</option>
                <option value='WV'>West Virgina(WV)</option>
                <option value='WI'>Wisconson(WI)</option>
                <option value='WY'>Wyoming(WY)</option>
              </select>
            </label><br/>
            <label>Zipcode: <input className='signup-input' type='text' placeholder='Zip here...' value={this.state.zip} onChange={ this.changeZip }></input></label><br/>
            <label>Email: <input className='signup-input' type='text' placeholder='Email here...' value={this.state.email} onChange={ this.changeEmail }></input></label><br/>
            <label>Password: <input className='signup-input' type='password' placeholder='Super secret password...' value={this.state.password} onChange={ this.changePassword }></input></label><br/>
            <label>Phone Number: <input className='signup-input' type='text' placeholder='Phone number here...' value={this.state.phone} onChange={ this.changePhone }></input></label><br/>
            <br/><input className='signup-submit' type='submit' value='Sign Up'/>
          </form>
          <button className='tologin-submit' onClick={() => {
            this.login();
          }}>Return to Login</button>
        </div>
      </div>
    )
  }
}