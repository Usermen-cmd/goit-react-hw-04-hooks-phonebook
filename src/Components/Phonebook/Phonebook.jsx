import { useState, useEffect } from 'react';
//Components
import FindContact from 'Components/Phonebook/FindContact/FindContact';
import AddContactForm from 'Components/Phonebook/AddContactForm/AddContactForm';
import ContactItems from 'Components/Phonebook/ContactItems/ContactItems';
//Utils
import sortArray from 'array-sort';
import isUniqueName from 'utils/isUniqName';
import getMessageForEmptyContactList from 'utils/getMessageForEmptyContactList';
//Styles
import { ContainerPhonebook } from 'styles/ContainerPhonebook';
import { ContactList } from 'styles/ContactList';
import { AlertMessage } from 'styles/AlertMessage';

export default function Phonebook() {
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(localStorage.getItem('state')) || [];
  });
  const [toggleMessage, setToggleMessage] = useState(false);
  const [toggleSort, setToggleSort] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(contacts));
  }, [contacts]);

  function getContact(contact) {
    const isUniqName = isUniqueName(contact.name, contacts);
    if (isUniqName) {
      setContacts(prevContacts => [...prevContacts, contact]);
      return;
    }

    setToggleMessage(!toggleMessage);
    const timeoutID = setTimeout(() => {
      setToggleMessage(prev => !prev);
      clearTimeout(timeoutID);
    }, 2000);
  }

  function onDeleteBtnClick(event) {
    const dataId = event.currentTarget.dataset.id;
    const remainderContacts = contacts.filter(contact => contact.id !== dataId);
    setContacts(remainderContacts);
  }

  function onSortBtnClick() {
    const sortContacts = sortArray(contacts, 'name', {
      reverse: toggleSort,
    });
    setContacts(sortContacts);
    setToggleSort(prev => !prev);
  }

  function addFindFilterValue(event) {
    const normalizeValue = event.target.value.toLowerCase();
    setFilter(normalizeValue);
  }

  function getFilterdContactList() {
    if (filter) {
      const filtredContacts = contacts.filter(el =>
        el.name.toLowerCase().includes(filter),
      );
      return filtredContacts;
    }
  }

  const filtredContactList = getFilterdContactList();
  const messageForEmptyContactList = getMessageForEmptyContactList(
    contacts,
    filtredContactList,
  );

  return (
    <ContainerPhonebook>
      <h1>Phonebook</h1>
      <AddContactForm submit={getContact}>
        {toggleMessage && (
          <AlertMessage>Такое имя уже есть в списке контактов</AlertMessage>
        )}
      </AddContactForm>
      <h2>contacts</h2>
      <FindContact addFindFilterValue={addFindFilterValue}>
        <button type="button" onClick={onSortBtnClick}>
          sort contact
        </button>
      </FindContact>
      <ContactList>
        <ContactItems
          contacts={filtredContactList || contacts}
          onDeleteClick={onDeleteBtnClick}
          noContactsMessage={messageForEmptyContactList}
        />
      </ContactList>
    </ContainerPhonebook>
  );
}
