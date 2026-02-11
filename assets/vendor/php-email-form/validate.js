/**
* PHP Email Form Validation - v3.10
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        return response.json();
      }
      if (response.ok) {
        return response.text();
      }
      throw new Error(`${response.status} ${response.statusText} ${response.url}`);
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      const isSuccess = (typeof data === 'object' && data.success) || (typeof data === 'string' && data.trim() === 'OK');
      if (isSuccess) {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset();
      } else {
        const msg = typeof data === 'object' ? (data.message || JSON.stringify(data)) : data;
        throw new Error(msg || 'Error al enviar el mensaje.');
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    const msg = error && error.message ? error.message : error;
    thisForm.querySelector('.error-message').innerHTML = msg;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
