import config from '../config/config';
import AxiosService from './axios-service';

const URL = config.baseUrl;

export default class AddressBookService {

  addContact(contactData) {
    return AxiosService.postService(`${URL}/addressBook/create`, contactData);
  }
  getAllContacts() {
    return AxiosService.getService(`${URL}/addressBook/get`);
  }
  getContactById(id) {
    return AxiosService.getService(`${URL}/addressBook/get/${id}`);
  }
  updateContact(contactData) {
    return AxiosService.putService(`${URL}/addressBook/update/${contactData.id}`, contactData);
  }
  deleteContact(id) {
    return AxiosService.deleteService(`${URL}/addressBook/delete/${id}`);
  }
}