document.addEventListener(
    "DOMContentLoaded",
    function () {
        const message =
            document.getElementById(
                "verifyEmailMessage"
            );

        const resendForm =
            document.getElementById(
                "resendVerificationForm"
            );

        const email =
            document.getElementById(
                "resendVerificationEmail"
            );

        const resendButton =
            document.getElementById(
                "resendVerificationSubmit"
            );

        const params =
            new URLSearchParams(
                window.location.search
            );

        const token =
            params.get(
                "token"
            );

        const emailParam =
            params.get(
                "email"
            );

        if (emailParam) {
            email.value =
                emailParam;
        }

        if (token) {
            verifyToken(
                token,
                message
            );
        } else {
            showMessage(
                message,
                "Enter your email below if you need a new verification link.",
                "info"
            );
        }

        resendForm.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();

                const value =
                    email.value
                        .trim()
                        .toLowerCase();

                if (!value) {
                    showMessage(
                        message,
                        "Enter your email address.",
                        "warning"
                    );

                    return;
                }

                resendButton.disabled =
                    true;

                try {
                    const response =
                        await fetch(
                            "api/auth/email/resend",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },
                                credentials:
                                    "same-origin",
                                body:
                                    JSON.stringify(
                                        {
                                            email:
                                                value
                                        }
                                    )
                            }
                        );

                    const data =
                        await response.json();

                    showMessage(
                        message,
                        data.message
                        ||
                        "If that account needs verification, an email will be sent.",
                        response.ok
                            ?
                            "success"
                            :
                            "danger"
                    );

                } catch (error) {
                    showMessage(
                        message,
                        "Unable to request another verification email.",
                        "danger"
                    );
                } finally {
                    resendButton.disabled =
                        false;
                }
            }
        );
    }
);

async function verifyToken(
    token,
    message
) {
    showMessage(
        message,
        "Verifying your email...",
        "info"
    );

    try {
        const response =
            await fetch(
                "api/auth/email/verify",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    credentials:
                        "same-origin",
                    body:
                        JSON.stringify(
                            {
                                token:
                                    token
                            }
                        )
                }
            );

        const data =
            await response.json();

        if (
            !response.ok
            ||
            !data.success
        ) {
            throw new Error(
                data.message
                ||
                "Unable to verify email."
            );
        }

        showMessage(
            message,
            data.message,
            "success"
        );

    } catch (error) {
        showMessage(
            message,
            error.message
            ||
            "Unable to verify email.",
            "danger"
        );
    }
}

function showMessage(
    element,
    text,
    type
) {
    element.className =
        `alert alert-${type}`;

    element.textContent =
        text;

    element.classList.remove(
        "d-none"
    );
}
