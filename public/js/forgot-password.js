document.addEventListener(
    "DOMContentLoaded",
    function () {
        const form =
            document.getElementById(
                "forgotPasswordForm"
            );

        const email =
            document.getElementById(
                "forgotPasswordEmail"
            );

        const message =
            document.getElementById(
                "forgotPasswordMessage"
            );

        const button =
            document.getElementById(
                "forgotPasswordSubmit"
            );

        form.addEventListener(
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

                button.disabled =
                    true;

                try {
                    const response =
                        await fetch(
                            "api/auth/password/forgot",
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

                    if (
                        !response.ok
                        ||
                        !data.success
                    ) {
                        throw new Error(
                            data.message
                            ||
                            "Unable to request a password reset."
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
                        "Unable to request a password reset.",
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
