document.addEventListener(
    "DOMContentLoaded",
    function () {
        const form =
            document.getElementById(
                "resetPasswordForm"
            );

        const password =
            document.getElementById(
                "resetPassword"
            );

        const confirm =
            document.getElementById(
                "resetPasswordConfirm"
            );

        const message =
            document.getElementById(
                "resetPasswordMessage"
            );

        const button =
            document.getElementById(
                "resetPasswordSubmit"
            );

        const token =
            new URLSearchParams(
                window.location.search
            )
            .get(
                "token"
            );

        if (!token) {
            showMessage(
                message,
                "This reset link is missing its token.",
                "danger"
            );

            button.disabled =
                true;

            return;
        }

        form.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();

                const value =
                    password.value;

                const confirmValue =
                    confirm.value;

                if (
                    value.length < 8
                    ||
                    !/[A-Za-z]/.test(
                        value
                    )
                    ||
                    !/\d/.test(
                        value
                    )
                ) {
                    showMessage(
                        message,
                        "Use at least 8 characters with at least one letter and one number.",
                        "warning"
                    );

                    return;
                }

                if (
                    value
                    !==
                    confirmValue
                ) {
                    showMessage(
                        message,
                        "Passwords do not match.",
                        "warning"
                    );

                    return;
                }

                button.disabled =
                    true;

                try {
                    const response =
                        await fetch(
                            "api/auth/password/reset",
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
                                                token,
                                            password:
                                                value
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
                            "Unable to reset password."
                        );
                    }

                    showMessage(
                        message,
                        data.message,
                        "success"
                    );

                    password.value =
                        "";

                    confirm.value =
                        "";

                    window.setTimeout(
                        function () {
                            window.location.href =
                                "login.html";
                        },
                        1200
                    );

                } catch (error) {
                    showMessage(
                        message,
                        error.message
                        ||
                        "Unable to reset password.",
                        "danger"
                    );
                } finally {
                    button.disabled =
                        false;
                }
            }
        );
    }
);

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
