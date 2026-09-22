/* Login Elements */

let loginForm;
let loginEmail;
let loginPassword;
let rememberEmail;
let togglePasswordButton;
let passwordToggleIcon;
let forgotPasswordButton;

let loginEmailError;
let loginPasswordError;
let loginMessage;

let loginButton;
let loginButtonText;
let loginButtonLoading;


/* Start */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        getLoginElements();

        loadRememberedEmail();

        setupLoginEvents();

    }
);


/* Elements */

function getLoginElements() {

    loginForm =
        document.getElementById(
            "loginForm"
        );

    loginEmail =
        document.getElementById(
            "loginEmail"
        );

    loginPassword =
        document.getElementById(
            "loginPassword"
        );

    rememberEmail =
        document.getElementById(
            "rememberEmail"
        );

    togglePasswordButton =
        document.getElementById(
            "togglePasswordButton"
        );

    passwordToggleIcon =
        document.getElementById(
            "passwordToggleIcon"
        );

    forgotPasswordButton =
        document.getElementById(
            "forgotPasswordButton"
        );

    loginEmailError =
        document.getElementById(
            "loginEmailError"
        );

    loginPasswordError =
        document.getElementById(
            "loginPasswordError"
        );

    loginMessage =
        document.getElementById(
            "loginMessage"
        );

    loginButton =
        document.getElementById(
            "loginButton"
        );

    loginButtonText =
        document.getElementById(
            "loginButtonText"
        );

    loginButtonLoading =
        document.getElementById(
            "loginButtonLoading"
        );

}


/* Events */

function setupLoginEvents() {

    loginForm.addEventListener(
        "submit",
        handleLoginSubmit
    );


    togglePasswordButton.addEventListener(
        "click",
        togglePasswordVisibility
    );


    forgotPasswordButton.addEventListener(
        "click",
        function () {

            showLoginMessage(
                "Password recovery will be connected to the backend later.",
                "info"
            );

        }
    );


    loginEmail.addEventListener(
        "input",
        function () {

            clearFieldError(
                loginEmail,
                loginEmailError
            );

        }
    );


    loginPassword.addEventListener(
        "input",
        function () {

            clearFieldError(
                loginPassword,
                loginPasswordError
            );

        }
    );

}


/* Login */

function handleLoginSubmit(
    event
) {

    event.preventDefault();


    clearLoginMessage();


    const email =
        loginEmail.value
            .trim()
            .toLowerCase();


    const password =
        loginPassword.value;


    const emailValid =
        validateEmail(
            email
        );


    const passwordValid =
        validatePassword(
            password
        );


    if (
        !emailValid
        ||
        !passwordValid
    ) {

        return;

    }


    handleRememberEmail(
        email
    );


    /*
        Frontend stage only.

        Do NOT store the password in localStorage.

        Later this section will become:

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        The Java LoginServlet will verify
        the account and create a server session.
    */


    setLoginLoading(
        true
    );


    window.setTimeout(
        function () {

            setLoginLoading(
                false
            );


            showLoginMessage(
                "Login form is valid. Backend authentication with LoginServlet has not been connected yet.",
                "success"
            );


            loginPassword.value =
                "";

        },
        650
    );

}


/* Validation */

function validateEmail(
    email
) {

    if (
        !email
    ) {

        setFieldError(
            loginEmail,
            loginEmailError,
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
            loginEmail,
            loginEmailError,
            "Please enter a valid email address."
        );

        return false;

    }


    clearFieldError(
        loginEmail,
        loginEmailError
    );


    return true;

}


function validatePassword(
    password
) {

    if (
        !password
    ) {

        setFieldError(
            loginPassword,
            loginPasswordError,
            "Please enter your password."
        );

        return false;

    }


    if (
        password.length < 6
    ) {

        setFieldError(
            loginPassword,
            loginPasswordError,
            "Password must contain at least 6 characters."
        );

        return false;

    }


    clearFieldError(
        loginPassword,
        loginPasswordError
    );


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


/* Password */

function togglePasswordVisibility() {

    const passwordVisible =
        loginPassword.type
        ===
        "text";


    loginPassword.type =
        passwordVisible
        ?
        "password"
        :
        "text";


    passwordToggleIcon.className =
        passwordVisible
        ?
        "bi bi-eye"
        :
        "bi bi-eye-slash";


    togglePasswordButton.setAttribute(
        "aria-label",
        passwordVisible
        ?
        "Show password"
        :
        "Hide password"
    );

}


/* Remember Email */

function handleRememberEmail(
    email
) {

    if (
        rememberEmail.checked
    ) {

        localStorage.setItem(
            "fithealthRememberedEmail",
            email
        );

    } else {

        localStorage.removeItem(
            "fithealthRememberedEmail"
        );

    }

}


function loadRememberedEmail() {

    const savedEmail =
        localStorage.getItem(
            "fithealthRememberedEmail"
        );


    if (
        !savedEmail
    ) {

        return;

    }


    loginEmail.value =
        savedEmail;


    rememberEmail.checked =
        true;

}


/* Loading */

function setLoginLoading(
    loading
) {

    loginButton.disabled =
        loading;


    loginButtonText.classList.toggle(
        "d-none",
        loading
    );


    loginButtonLoading.classList.toggle(
        "d-none",
        !loading
    );

}


/* Message */

function showLoginMessage(
    message,
    type
) {

    loginMessage.className =
        `alert alert-${type}`;


    loginMessage.textContent =
        message;


    loginMessage.classList.remove(
        "d-none"
    );

}


function clearLoginMessage() {

    loginMessage.className =
        "alert d-none";


    loginMessage.textContent =
        "";

}
