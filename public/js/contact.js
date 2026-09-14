/* Elements */

const contactForm =
    document.getElementById(
        "contactForm"
    );

const firstName =
    document.getElementById(
        "firstName"
    );

const lastName =
    document.getElementById(
        "lastName"
    );

const email =
    document.getElementById(
        "formEmail"
    );

const phone =
    document.getElementById(
        "phone"
    );

const message =
    document.getElementById(
        "message"
    );

const subscribe =
    document.getElementById(
        "subscribe"
    );

const formStatus =
    document.getElementById(
        "formStatus"
    );


/* Submit */

contactForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearErrors();


        const valid =
            validateForm();


        if (!valid) {
            return;
        }


        const formData = {

            firstName:
                firstName.value.trim(),

            lastName:
                lastName.value.trim(),

            email:
                email.value.trim(),

            phone:
                phone.value.trim(),

            message:
                message.value.trim(),

            subscribe:
                subscribe.checked

        };


        console.log(
            formData
        );


        try {

            const response =
                await fetch(
                    "/api/contact",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                formData
                            )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to send message"
                );

            }


            showSuccess();


            contactForm.reset();

        }

        catch (error) {

            console.error(
                error
            );


            showFormError();

        }

    }
);


/* Validate */

function validateForm() {

    let valid =
        true;


    const namePattern =
        /^[A-Za-zÀ-ỹ\s'-]{2,50}$/;


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const phonePattern =
        /^[0-9+\s()-]{9,20}$/;


    if (
        !namePattern.test(
            firstName.value.trim()
        )
    ) {

        showError(
            firstName,
            "firstNameError"
        );

        valid =
            false;

    }


    if (
        !namePattern.test(
            lastName.value.trim()
        )
    ) {

        showError(
            lastName,
            "lastNameError"
        );

        valid =
            false;

    }


    if (
        !emailPattern.test(
            email.value.trim()
        )
    ) {

        showError(
            email,
            "emailError"
        );

        valid =
            false;

    }


    if (
        !phonePattern.test(
            phone.value.trim()
        )
    ) {

        showError(
            phone,
            "phoneError"
        );

        valid =
            false;

    }


    if (
        message.value.trim().length
        <
        10
    ) {

        showError(
            message,
            "messageError"
        );

        valid =
            false;

    }


    return valid;

}


/* Error */

function showError(
    input,
    errorId
) {

    input.classList.add(
        "input-error"
    );


    const error =
        document.getElementById(
            errorId
        );


    if (error) {

        error.style.display =
            "block";

    }

}


/* Clear */

function clearErrors() {

    const inputs =
        contactForm.querySelectorAll(
            ".form-control"
        );


    inputs.forEach(
        function (input) {

            input.classList.remove(
                "input-error"
            );

        }
    );


    const errors =
        contactForm.querySelectorAll(
            ".error-message"
        );


    errors.forEach(
        function (error) {

            error.style.display =
                "none";

        }
    );


    formStatus.innerHTML =
        "";

}


/* Success */

function showSuccess() {

    formStatus.innerHTML = `
        <div class="form-success">

            <i class="bi bi-check-circle-fill me-2"></i>

            Your information has been sent successfully.

        </div>
    `;

}


/* Form Error */

function showFormError() {

    formStatus.innerHTML = `
        <div class="form-error">

            <i class="bi bi-exclamation-circle-fill me-2"></i>

            Unable to send your information.

        </div>
    `;

}