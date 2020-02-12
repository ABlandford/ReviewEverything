import React, {Component} from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = { redirect: null, userId: "", username: "", fname: "", lname: "", street: "", city: "", stateVal: "", zip: "", email: "", phone: "" };
    this.changeUName = this.changeUName.bind(this);
    this.changeFName = this.changeFName.bind(this);
    this.changeLName = this.changeLName.bind(this);
    this.changeStreet = this.changeStreet.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeZip = this.changeZip.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
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

  changePhone(event) {
    this.setState({phone : event.target.value})
  }

  updateInfo(event) {
    event.preventDefault();

    const data = { userId: this.state.userId, username: this.state.username, fname: this.state.fname, lname: this.state.lname, street: this.state.street, city: this.state.city, state: this.state.stateVal, zip_code: this.state.zip, email: this.state.email, phone: this.state.phone };

    console.log(data);

    fetch('http://localhost:9000/test/editAccount', {
      method: 'PUT',
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
    let currentUser = cookies.get('currentUser');
    this.setState({ userId: currentUser._id, username: currentUser.username, fname: currentUser.fname, lname: currentUser.lname, street: currentUser.street, city: currentUser.city, stateVal: currentUser.state, zip: currentUser.zip_code, email: currentUser.email, phone: currentUser.phone });
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to={ this.state.redirect }/>
    }
    return(
      <div>
        <section>
          <form onSubmit={ this.updateInfo }>
            <label>Username: <input type='text' placeholder='Username here...' value={this.state.username} onChange={ this.changeUName }></input></label><br/>
            <label>First Name: <input type='text' placeholder='First name here...' value={this.state.fname} onChange={ this.changeFName }></input></label><br/>
            <label>Last Name: <input type='text' placeholder='Last name here...' value={this.state.lname} onChange={ this.changeLName }></input></label><br/>
            <label>Street Address: <input type='text' placeholder='Street address here...' value={this.state.street} onChange={ this.changeStreet }></input></label><br/>
            <label>City: <input type='text' placeholder='City here...' value={this.state.city} onChange={ this.changeCity }></input></label><br/>
            <label>State: <select value={this.state.stateVal} onChange={ this.changeState }>
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
            <label>Zipcode: <input type='text' placeholder='Zip here...' value={this.state.zip} onChange={ this.changeZip }></input></label><br/>
            <label>Email: <input type='text' placeholder='Email here...' value={this.state.email} onChange={ this.changeEmail }></input></label><br/>
            <label>Phone Number: <input type='text' placeholder='Phone number here...' value={this.state.phone} onChange={ this.changePhone }></input></label><br/>
            <br/><input type='submit' value='Update Account'/>
          </form>
        </section>
      </div>
    );
  }
}
