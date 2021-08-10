import React from 'react';
import deleteIcon from '../../assets/icons/delete-black-18dp.svg';
import editIcon from '../../assets/icons/create-black-18dp.svg';
import './display.scss';
import {withRouter} from 'react-router-dom';
import AddressBookService from '../../services/address-book-service';

const Display = (props) => {

  const edit = (id) => {
    props.history.push(`/address-book-form/${id}`);
  }
  const remove = (id) => {
    var deleteChoice = window.confirm("Contact will be deleted permanently!!!\nDo you wish to continue ?");
    if(deleteChoice) {
      new AddressBookService().deleteContact(id)
      .then(responseText => {
        alert("Contact deleted successfully!!!");
        window.location.reload();
      }).catch(error => {
        alert("Error occurred while deleting the Contact!!!");
        console.log("Delete Error : " + JSON.stringify(error));
      });
    }
  }
  return (
    <table id="display" className="table">
      <tbody>        
        <tr key={-1}>
          <th>FullName</th>
          <th>Address</th>
          <th>City</th>
          <th>State</th>
          <th>Zip Code</th>
          <th>Phone Number</th>
          <th>Actions</th>
          <th></th>
        </tr>
        {
          props.contactArray && props.contactArray.map((contact, ind) => (
            <tr key={ind}>
                <td>{contact.name}</td>
                <td>{contact.address}</td>
                <td>{contact.city}</td>
                <td>{contact.state}</td>
                <td>{contact.zipcode}</td>
                <td>{contact.phoneNumber}</td>
                <td><img src={deleteIcon} onClick={() => remove(contact.id)} alt="delete" />
                    <img src={editIcon} onClick={() => edit(contact.id)} alt="edit" /></td>
            </tr>
          ))
        }
        </tbody>
    </table>
  );
}

export default withRouter(Display);