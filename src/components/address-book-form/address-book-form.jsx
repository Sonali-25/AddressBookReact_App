import React from 'react';
import './address-book-form.scss';
import logo from '../../assets/images/logo.png';
import cross from '../../assets/images/cross.png'
import {Link, withRouter} from 'react-router-dom';
import AddressBookService from '../../services/address-book-service'; 

const initialState = {
  name: '',
  address: '',  
  city: '',
  state: '',
  zipcode: '',
  phoneNumber: '',

  id: '',      
  isUpdate: false,
  isError: false,

  error: {name: '', address: '', city: '', state: '', zipcode: '', phoneNumber: ''},  
  valid: {name: '',address: '',city: '',state: '',zipcode: '',phoneNumber: ''}
}
class AddressBookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      phoneNumber: '',

      id: '',      
      isUpdate: false,
      isError: false,

      error: {name: '',address: '',city: '',state: '',zipcode: '',phoneNumber: ''},  
      valid: {name: '',address: '',city: '',state: '',zipcode: '',phoneNumber: ''}
    }
    this.nameChangeHandler = this.nameChangeHandler.bind(this);
    this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this);
    this.addressChangeHandler = this.addressChangeHandler.bind(this);
    this.cityChangeHandler = this.cityChangeHandler.bind(this);
    this.stateChangeHandler = this.stateChangeHandler.bind(this);
    this.zipcodeChangeHandler = this.zipcodeChangeHandler.bind(this);
  }

  componentDidMount = () => {
    let id = this.props.match.params.id;
    if(id !== undefined && id!=='') {
      this.getContactById(id);
    }
  }

  getContactById = (id) => {
    new AddressBookService().getContactById(id)
    .then(responseDTO => {
      let responseText = responseDTO.data;
      this.setContactData(responseText.data);
    }).catch(error => {
      console.log("Error while fetching contact data by ID :\n" + JSON.stringify(error));
    })
  }
  setContactData = (contact) => {
    this.setState({
      id: contact.id,
      name: contact.name,
      address: contact.address,
      city: contact.city,
      state: contact.state,
      zipcode: contact.zipcode,
      phoneNumber: contact.phoneNumber,
      isUpdate: true
    });
  }

  nameChangeHandler = (event) => {
    this.setState({name: event.target.value});
    this.checkName(event.target.value);
  }
  phoneNumberChangeHandler = (event) => {
    this.setState({phoneNumber: event.target.value});
    this.checkPhoneNumber(event.target.value);
  }
  addressChangeHandler = (event) => {
    this.setState({address: event.target.value});
    this.checkAddress(event.target.value);
  }
  cityChangeHandler = (event) => {
    this.setState({city: event.target.value})
    this.checkSelect('city', event.target.value);
  }
  stateChangeHandler = (event) => {
    this.setState({state: event.target.value});
    this.checkSelect('state', event.target.value);
  }
  zipcodeChangeHandler = (event) => {
    this.setState({zipcode: event.target.value});
    this.checkZipCode(event.target.value);
  }

  initializeMessage = (field, errorMessage, validMessage) => {
    this.setState(previousState => ({
      error: {
        ...previousState.error,
        [field]: errorMessage
      }
    }));
    this.setState(previousState => ({
      valid: {
        ...previousState.valid,
        [field]: validMessage
      }
    }));
  }
  checkName = (nameValue) => {
    if(nameValue.length === 0) {
      this.initializeMessage('name', '', '');
    } else {
      const NAME_REGEX = RegExp("^[A-Z]{1}[a-z A-Z\s]{2,}$");
      if(NAME_REGEX.test(nameValue)) {
        this.initializeMessage('name', '', '');
      } else {
        this.initializeMessage('name', 'Name is Invalid!', '');
      }
    }
  }
  checkPhoneNumber = (phoneNumberValue) => {
    if(phoneNumberValue.length === 0) {
      this.initializeMessage('phoneNumber', '', '');
    } else {
      const PHONE_NUMBER_REGEX = RegExp("((^\\+?)(([0-9]{2,3})(\\s))?)[1-9]{1}[0-9]{9}$");
      if(PHONE_NUMBER_REGEX.test(phoneNumberValue)) {
        this.initializeMessage('phoneNumber', '', '');
      } else {
        this.initializeMessage('phoneNumber', 'Phone Number is Invalid!', '');
      }
    }
  }
  checkAddress = (addressValue) => {
    if(addressValue.length === 0) {
      this.initializeMessage('address', '', '');
    } else {
      const PHONE_NUMBER_REGEX = RegExp("^[A-Za-z0-9-,\\.]{3,}([\\s][A-Za-z0-9-,\\.]{3,}){0,}$");
      if(PHONE_NUMBER_REGEX.test(addressValue)) {
        this.initializeMessage('address', '', '');
      } else {
        this.initializeMessage('address', 'Address is Invalid!', '');
      }
    }
  }
  checkSelect = (field, fieldValue) => {
    if(fieldValue.length === 0) {
      this.initializeMessage(field, '', '');
    } else {
      this.initializeMessage(field, '', '');
    }    
  }
  checkZipCode = (zipcodeValue) => {
    if(zipcodeValue.length === 0) {
      this.initializeMessage('zipcode', '', '');
    } else {
      const ZIP_CODE_REGEX = RegExp("^[1-9]{1}[0-9]{5}$");
      if(ZIP_CODE_REGEX.test(zipcodeValue)) {
        this.initializeMessage('zipcode', '', '');
      } else {
        this.initializeMessage('zipcode', '', '');
      }
    }
  }

  checkGlobalError = () =>{
    if(this.state.error.name.length === 0 && this.state.error.address.length === 0 && this.state.error.city.length === 0 
      && this.state.error.state.length === 0 && this.state.error.zipcode.length === 0 && this.state.error.phoneNumber.length === 0) {
        this.setState({isError: false});
      } else {
        this.setState({isError: true});
      }
  }

  checkValidations = async () => {
    await this.checkName(this.state.name);
    await this.checkAddress(this.state.address);
    await this.checkSelect('city',this.state.city);
    await this.checkSelect('state',this.state.state);
    await this.checkZipCode(this.state.zipcode);
    await this.checkPhoneNumber(this.state.phoneNumber);
    await this.checkGlobalError();
    return (this.state.isError);
  }
  save = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    saveOperation: {         
      if(await this.checkValidations()) {
        let errorLog = JSON.stringify(this.state.error);
        alert("Error Occured while Submitting the Form ==> ERROR LOG : " + errorLog);
        break saveOperation;
      }    
      let contactObject = {
        id: this.state.id,
        name: this.state.name,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zipcode: this.state.zipcode,
        phoneNumber: this.state.phoneNumber
      }
      if(this.state.isUpdate) {
        new AddressBookService().updateContact(contactObject)
        .then(responseText => {
          alert("Contact Updated Successfully!!!\n");
        //   this.reset();
          this.props.history.push("/home");
        }).catch(error => {
          console.log("Error while updating Contact!!!\n" + JSON.stringify(error));
        })
      } else {
        new AddressBookService().addContact(contactObject)
        .then(responseDTO => {
          let responseText = responseDTO.data;
          alert("Contact Added Successfully!!!\n" );
        //   this.reset();
          this.props.history.push("/home");
        }).catch(error => {
          console.log("Error while adding Contact!!!\n" + JSON.stringify(error));
        });
        this.reset();
      }
    }
  }

  reset = () => {
    this.setState({...initialState});
  }

  render () {
    return (
      <div className="body">
        <header className="headerContainer header">
            <div className="logoContainer">
                <img src={logo} alt="" />
                <div>
                    <span className="address-text">ADDRESS</span><br />
                    <span className="address-text book-text">BOOK</span>
                </div>
            </div>
        </header>
        <div className="form-content">
            <form className="form" action="#" onSubmit={this.save} onReset={this.reset}>
                <div className="form-head">
                    <div className="form-text">Person Address Form</div>
                    <div>
                        <Link to=''><img className="cancel-img" src={cross} alt="" /></Link>
                    </div>
                </div>
                <div className="row-content">
                    <label htmlFor="full-name" className="label text">Full Name</label>
                    <div className="validity-check">
                        <input className="input" value={this.state.name} onChange={this.nameChangeHandler} type="text" id="full-name" name="full-name" required />
                        <valid-message className="valid-full-name" htmlFor="full-name">{this.state.valid.name}</valid-message>
                        <error-output className="full-name-error" htmlFor="full-name">{this.state.error.name}</error-output>
                    </div>
                </div>
                <div className="row-content">
                    <label htmlFor="tel" className="label text">Phone Number</label>
                    <div className="validity-check">
                        <input className="input" value={this.state.phoneNumber} onChange={this.phoneNumberChangeHandler} type="tel" id="tel" name="tel" />
                        <valid-message className="valid-tel" htmlFor="tel">{this.state.valid.phoneNumber}</valid-message>
                        <error-output className="tel-error" htmlFor="tel">{this.state.error.phoneNumber}</error-output>
                    </div>
                </div>
                <div className="row-content">
                    <label htmlFor="address" className="label text">Address</label>
                    <div className="validity-check">
                        <textarea className="input text" value={this.state.address} onChange={this.addressChangeHandler} name="address" id="address" style={{height: "100px"}} ></textarea>
                        <valid-message className="valid-address" htmlFor="address">{this.state.valid.address}</valid-message>
                        <error-output className="address-error" htmlFor="address">{this.state.error.address}</error-output>
                    </div>
                </div>
                <div className="select-elements">
                    <div name="select-city" id="select-city" className="select-div">
                        <label htmlFor="city" className="label text">City</label>
                        <div className="validity-check">
                          <select name="city" id="city" value={this.state.city} onChange={this.cityChangeHandler}>
                            <option value="" hidden>Select City</option>
                            <option value="Lucknow">Lucknow</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Patna">Patna</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Hydrabad">Hydrabad</option>
                            <option value="Kanpur">Kanpur</option>
                            <option value="Jaipur">Jaipur</option>
                            <option value="Surat">Surat</option>
                            <option value="Indore">indore</option>
                            <option value="Pune">Pune</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Thane">Thane</option>
                            <option value="Vadodra">Vadodra</option>
                            <option value="Nagpur">Nagpur</option>
                            <option value="Agra">Agra</option>
                            <option value="Meerut">Meerut</option>
                            <option value="Ghaziabad">Ghaziabad</option>
                            <option value="Srinagar">Srinagar</option>
                            <option value="Agra">Agra</option>
                            <option value="Nashik">Nashik</option>
                            <option value="Aurangabad">Aurangabad</option>
                            <option value="Amritsar">Amritsar</option>
                            <option value="Navi Mumbai">Navi Mumbai</option>
                            <option value="Ranchi">Ranchi</option>
                          </select>
                          <valid-message className="valid-city" htmlFor="city">{this.state.valid.city}</valid-message>
                          <error-output className="city-error" htmlFor="city">{this.state.error.city}</error-output>
                        </div>
                    </div>
                    <div name="select-state" id="select-state" className="select-div">
                        <label htmlFor="state" className="label text">State</label>
                        <div className="validity-check">
                          <select name="state" id="state" value={this.state.state} onChange={this.stateChangeHandler}>
                            <option value="" hidden>Select State</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Goa">Goa</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhatisgarh">Chhatisgarh</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himanchal Pradesh">Himanchal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttrakhand">Uttrakhand</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Maharashtra">Maharashtra</option>
                          </select>
                          <valid-message className="valid-state" htmlFor="state">{this.state.valid.state}</valid-message>
                          <error-output className="state-error" htmlFor="state">{this.state.error.state}</error-output>
                        </div>
                    </div>
                    <div name="select-zip" id="select-zip" className="select-div">
                        <label htmlFor="zip" className="label text">Zip Code</label>
                        <div className="validity-check">
                          <input className="input" type="number" id="zipcode"  value={this.state.zipcode} onChange={this.zipcodeChangeHandler} />                          
                          <valid-message className="valid-zip" htmlFor="zip">{this.state.valid.zipcode}</valid-message>
                          <error-output className="zip-error" htmlFor="zip">{this.state.error.zipcode}</error-output>
                        </div>
                     </div>
                </div>
                <div className="buttonParent">
                    <div className="submit-reset">
                        <button type="submit" className="button submitButton">{this.state.isUpdate ? 'Update' : 'Add'}</button>
                        <button type="reset" className="resetButton button">Reset</button>
                    </div>
                </div>
            </form>
        </div>
      </div>
    );
  }
}

export default withRouter(AddressBookForm);