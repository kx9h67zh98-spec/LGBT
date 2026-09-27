/* Register Elements */

let registerForm;

let firstName;
let lastName;
let registerEmail;
let registerPassword;
let confirmPassword;
let agreeTerms;

let firstNameError;
let lastNameError;
let registerEmailError;
let registerPasswordError;
let confirmPasswordError;
let agreeTermsError;

let togglePasswordButton;
let passwordToggleIcon;
let toggleConfirmPasswordButton;
let confirmPasswordToggleIcon;

let passwordStrengthBar;
let passwordStrengthText;

let registerMessage;

let registerButton;
let registerButtonText;
let registerButtonLoading;


/* Start */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        getRegisterElements();

        setupRegisterEvents();

    }
);


/* Elements */

function getRegisterElements() {

    registerForm =
        document.getElementById(
            "registerForm"
        );

    firstName =
        document.getElementById(
            "firstName"
        );

    lastName =
        document.getElementById(
            "lastName"
        );

    registerEmail =
        document.getElementById(
            "registerEmail"
        );

    registerPassword =
        document.getElementById(
            "registerPassword"
        );

    confirmPassword =
        document.getElementById(
            "confirmPassword"
        );

    agreeTerms =
        document.getElementById(
            "agreeTerms"
        );


    firstNameError =
        document.getElementById(
            "firstNameError"
        );

    lastNameError =
        document.getElementById(
            "lastNameError"
        );

    registerEmailError =
        document.getElementById(
            "registerEmailError"
        );

    registerPasswordError =
        document.getElementById(
            "registerPasswordError"
        );

    confirmPasswordError =
        document.getElementById(
            "confirmPasswordError"
        );

    agreeTermsError =
        document.getElementById(
            "agreeTermsError"
        );


    togglePasswordButton =
        document.getElementById(
            "togglePasswordButton"
        );

    passwordToggleIcon =
        document.getElementById(
            "passwordToggleIcon"
        );

    toggleConfirmPasswordButton =
        document.getElementById(
            "toggleConfirmPasswordButton"
        );

    confirmPasswordToggleIcon =
        document.getElementById(
            "confirmPasswordToggleIcon"
        );


    passwordStrengthBar =
        document.getElementById(
            "passwordStrengthBar"
        );

    passwordStrengthText =
        document.getElementById(
            "passwordStrengthText"
        );


    registerMessage =
        document.getElementById(
            "registerMessage"
        );


    registerButton =
        document.getElementById(
            "registerButton"
        );

    registerButtonText =
        document.getElementById(
            "registerButtonText"
        );

    registerButtonLoading =
        document.getElementById(
            "registerButtonLoading"
        );

}


/* Events */

function setupRegisterEvents() {

    registerForm.addEventListener(
        "submit",
        handleRegisterSubmit
    );


    togglePasswordButton.addEventListener(
        "click",
        function () {

            togglePasswordVisibility(
                registerPassword,
                passwordToggleIcon,
                togglePasswordButton,
                "password"
            );

        }
    );


    toggleConfirmPasswordButton.addEventListener(
        "click",
        function () {

            togglePasswordVisibility(
                confirmPassword,
                confirmPasswordToggleIcon,
                toggleConfirmPasswordButton,
                "confirm password"
            );

        }
    );


    firstName.addEventListener(
        "input",
        function () {

            clearFieldError(
                firstName,
                firstNameError
            );

        }
    );


    lastName.addEventListener(
        "input",
        function () {

            clearFieldError(
                lastName,
                lastNameError
            );

        }
    );


    registerEmail.addEventListener(
        "input",
        function () {

            clearFieldError(
                registerEmail,
                registerEmailError
            );

        }
    );


    registerPassword.addEventListener(
        "input",
        function () {

            clearFieldError(
                registerPassword,
                registerPasswordError
            );


            updatePasswordStrength(
                registerPassword.value
            );


            if (
                confirmPassword.value
            ) {

                validateConfirmPassword(
                    registerPassword.value,
                    confirmPassword.value
                );

            }

        }
    );


    confirmPassword.addEventListener(
        "input",
        function () {

            validateConfirmPassword(
                registerPassword.value,
                confirmPassword.value
            );

        }
    );


    agreeTerms.addEventListener(
        "change",
        function () {

            if (
                agreeTerms.checked
            ) {

                agreeTermsError.textContent =
                    "";

            }

        }
    );

}


/* Submit */

function handleRegisterSubmit(
    event
) {

    event.preventDefault();


    clearRegisterMessage();


    const firstNameValue =
        firstName.value.trim();


    const lastNameValue =
        lastName.value.trim();


    const emailValue =
        registerEmail.value
            .trim()
            .toLowerCase();


    const passwordValue =
        registerPassword.value;


    const confirmPasswordValue =
        confirmPassword.value;


    const firstNameValid =
        validateName(
            firstName,
            firstNameError,
            firstNameValue,
            "first name"
        );


    const lastNameValid =
        validateName(
            lastName,
            lastNameError,
            lastNameValue,
            "last name"
        );


    const emailValid =
        validateEmail(
            emailValue
        );


    const passwordValid =
        validatePassword(
            passwordValue
        );


    const confirmPasswordValid =
        validateConfirmPassword(
            passwordValue,
            confirmPasswordValue
        );


    const termsValid =
        validateTerms();


    if (
        !firstNameValid
        ||
        !lastNameValid
        ||
        !emailValid
        ||
        !passwordValid
        ||
        !confirmPasswordValid
        ||
        !termsValid
    ) {

        return;

    }


    /*
        Frontend stage only.

        Do NOT save passwords in localStorage.

        Later this section will become:

        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstNameValue,
                lastName: lastNameValue,
                email: emailValue,
                password: passwordValue
            })
        })

        RegisterServlet will:
        1. Validate input again.
        2. Check whether the email already exists.
        3. Hash the password.
        4. Create the User entity.
        5. Persist it using JPA.
    */


    setRegisterLoading(
        true
    );


    window.setTimeout(
        function () {

            setRegisterLoading(
                false
            );


            showRegisterMessage(
                "Registration form is valid. Account creation with RegisterServlet has not been connected yet.",
                "success"
            );


            registerPassword.value =
                "";


            confirmPassword.value =
                "";


            updatePasswordStrength(
                ""
            );

        },
        700
    );

}


/* Name Validation */

function validateName(
    input,
    errorElement,
    value,
    fieldName
) {

    if (
        !value
    ) {

        setFieldError(
            input,
            errorElement,
            `Please enter your ${fieldName}.`
        );

        return false;

    }


    if (
        value.length < 2
    ) {

        setFieldError(
            input,
            errorElement,
            `${capitalize(fieldName)} must contain at least 2 characters.`
        );

        return false;

    }


    clearFieldError(
        input,
        errorElement
    );


    return true;

}


/* Email Validation */

function validateEmail(
    email
) {

    if (
        !email
    ) {

        setFieldError(
            registerEmail,
            registerEmailError,
            "Please enter your email."
        );

        return false;

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailPattern.test(
            email
        )
    ) {

        setFieldError(
            registerEmail,
            registerEmailError,
            "Please enter a valid email address."
        );

        return false;

    }


    clearFieldError(
        registerEmail,
        registerEmailError
    );


    return true;

}


/* Password Validation */

function validatePassword(
    password
) {

    if (
        !password
    ) {

        setFieldError(
            registerPassword,
            registerPasswordError,
            "Please create a password."
        );

        return false;

    }


    if (
        password.length < 8
    ) {

        setFieldError(
            registerPassword,
            registerPasswordError,
            "Password must contain at least 8 characters."
        );

        return false;

    }


    if (
        !/[A-Za-z]/.test(
            password
        )
        ||
        !/\d/.test(
            password
        )
    ) {

        setFieldError(
            registerPassword,
            registerPasswordError,
            "Password must contain at least one letter and one number."
        );

        return false;

    }


    clearFieldError(
        registerPassword,
        registerPasswordError
    );


    return true;

}


/* Confirm Password */

function validateConfirmPassword(
    password,
    confirmation
) {

    if (
        !confirmation
    ) {

        setFieldError(
            confirmPassword,
            confirmPasswordError,
            "Please confirm your password."
        );

        return false;

    }


    if (
        password !== confirmation
    ) {

        setFieldError(
            confirmPassword,
            confirmPasswordError,
            "Passwords do not match."
        );

        return false;

    }


    clearFieldError(
        confirmPassword,
        confirmPasswordError
    );


    return true;

}


/* Terms */

function validateTerms() {

    if (
        !agreeTerms.checked
    ) {

        agreeTermsError.textContent =
            "Please agree to the terms before creating an account.";


        return false;

    }


    agreeTermsError.textContent =
        "";


    return true;

}


/* Field Errors */

function setFieldError(
    input,
    errorElement,
    message
) {

    input.classList.add(
        "is-invalid"
    );


    errorElement.textContent =
        message;

}


function clearFieldError(
    input,
    errorElement
) {

    input.classList.remove(
        "is-invalid"
    );


    errorElement.textContent =
        "";

}


/* Password Visibility */

function togglePasswordVisibility(
    input,
    icon,
    button,
    label
) {

    const visible =
        input.type
        ===
        "text";


    input.type =
        visible
        ?
        "password"
        :
        "text";


    icon.className =
        visible
        ?
        "bi bi-eye"
        :
        "bi bi-eye-slash";


    button.setAttribute(
        "aria-label",
        visible
        ?
        `Show ${label}`
        :
        `Hide ${label}`
    );

}


/* Password Strength */

function updatePasswordStrength(
    password
) {

    passwordStrengthBar.className =
        "password-strength-bar";


    passwordStrengthText.className =
        "fw-semibold text-body-secondary";


    if (
        !password
    ) {

        passwordStrengthText.textContent =
            "Not set";


        return;

    }


    let score =
        0;


    if (
        password.length >= 8
    ) {

        score++;

    }


    if (
        /[A-Za-z]/.test(
            password
        )
        &&
        /\d/.test(
            password
        )
    ) {

        score++;

    }


    if (
        password.length >= 10
        &&
        /[A-Z]/.test(
            password
        )
        &&
        /[^A-Za-z0-9]/.test(
            password
        )
    ) {

        score++;

    }


    if (
        score <= 1
    ) {

        passwordStrengthBar.classList.add(
            "strength-weak"
        );


        passwordStrengthBar.style.backgroundColor =
            "var(--bs-danger)";


        passwordStrengthText.textContent =
            "Weak";


        passwordStrengthText.className =
            "fw-semibold text-danger";


        return;

    }


    if (
        score === 2
    ) {

        passwordStrengthBar.classList.add(
            "strength-medium"
        );


        passwordStrengthBar.style.backgroundColor =
            "var(--bs-warning)";


        passwordStrengthText.textContent =
            "Medium";


        passwordStrengthText.className =
            "fw-semibold text-warning";


        return;

    }


    passwordStrengthBar.classList.add(
        "strength-strong"
    );


    passwordStrengthBar.style.backgroundColor =
        "var(--bs-success)";


    passwordStrengthText.textContent =
        "Strong";


    passwordStrengthText.className =
        "fw-semibold text-success";

}


/* Loading */

function setRegisterLoading(
    loading
) {

    registerButton.disabled =
        loading;


    registerButtonText.classList.toggle(
        "d-none",
        loading
    );


    registerButtonLoading.classList.toggle(
        "d-none",
        !loading
    );

}


/* Message */

function showRegisterMessage(
    message,
    type
) {

    registerMessage.className =
        `alert alert-${type}`;


    registerMessage.textContent =
        message;


    registerMessage.classList.remove(
        "d-none"
    );

}


function clearRegisterMessage() {

    registerMessage.className =
        "alert d-none";


    registerMessage.textContent =
        "";

}


/* Helper */

function capitalize(
    value
) {

    return (
        value.charAt(0).toUpperCase()
        +
        value.slice(1)
    );

}
