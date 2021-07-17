import { useState } from 'react';
// import PropTypes from 'prop-types';
//Utils
import DisplayingErrorMessagesSchema from 'utils/validationInput';
import { Formik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
//Components
import { AiFillPlusCircle, AiOutlineClose } from 'react-icons/ai';
import ContactForm from 'Components/Phonebook/AddContactForm/ContactForm';

const AddContactForm = ({ submit, children }) => {
  const [buttonStatus, setButtonStatus] = useState(false);

  function toggleForm() {
    setButtonStatus(prev => !prev);
  }

  function onSubmitForm(event, actions) {
    const id = uuidv4();
    submit({ ...event, id });
    actions.resetForm();
  }

  return (
    <>
      <button type="button" onClick={toggleForm}>
        {buttonStatus ? (
          <AiOutlineClose size={30} />
        ) : (
          <AiFillPlusCircle size={30} />
        )}
      </button>
      {buttonStatus && (
        <Formik
          initialValues={{
            name: '',
            tel: '',
          }}
          onSubmit={onSubmitForm}
          validationSchema={DisplayingErrorMessagesSchema}
        >
          {({ errors, touched }) => (
            <ContactForm errors={errors} touched={touched}>
              {buttonStatus && children}
            </ContactForm>
          )}
        </Formik>
      )}
    </>
  );
};

export default AddContactForm;
