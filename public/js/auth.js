document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await checkAuthentication();

        setupLogoutButton();

    }
);


async function checkAuthentication() {

    try {

        const response =
            await fetch(
                "api/auth/me",
                {
                    method:
                        "GET",

                    credentials:
                        "same-origin",

                    cache:
                        "no-store"
                }
            );


        if (
            response.status === 401
        ) {

            window.location.href =
                "login.html";

            return null;

        }


        const data =
            await response.json();


        if (
            !response.ok
            ||
            !data.success
            ||
            !data.authenticated
        ) {

            window.location.href =
                "login.html";

            return null;

        }


        window.FitHealthCurrentUser =
            data.user;


        document.dispatchEvent(
            new CustomEvent(
                "fithealth:user-authenticated",
                {
                    detail:
                        data.user
                }
            )
        );


        return data.user;

    } catch (
        error
    ) {

        console.error(
            "Authentication check failed:",
            error
        );


        window.location.href =
            "login.html";


        return null;

    }

}


function setupLogoutButton() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (
        !logoutButton
    ) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        handleLogout
    );

}


async function handleLogout() {

    try {

        const response =
            await fetch(
                "logout",
                {
                    method:
                        "POST",

                    credentials:
                        "same-origin"
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Logout failed."
            );

        }


        window.location.href =
            "login.html";

    } catch (
        error
    ) {

        console.error(
            "Logout error:",
            error
        );

    }

}