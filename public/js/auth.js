window.FitHealthCsrfToken = null;

(function installProtectedFetch() {
    const nativeFetch =
        window.fetch.bind(
            window
        );

    window.fetch =
        function (
            input,
            init
        ) {
            const options =
                init
                    ?
                    { ...init }
                    :
                    {};

            const method =
                String(
                    options.method
                    ||
                    (
                        input instanceof Request
                            ?
                            input.method
                            :
                            "GET"
                    )
                )
                .toUpperCase();

            const unsafe =
                ![
                    "GET",
                    "HEAD",
                    "OPTIONS"
                ].includes(
                    method
                );

            let url;

            try {
                url =
                    new URL(
                        input instanceof Request
                            ?
                            input.url
                            :
                            input,
                        window.location.href
                    );
            } catch (error) {
                url =
                    null;
            }

            if (
                unsafe
                &&
                url
                &&
                url.origin
                    ===
                    window.location.origin
                &&
                window.FitHealthCsrfToken
            ) {
                const headers =
                    new Headers(
                        options.headers
                        ||
                        (
                            input instanceof Request
                                ?
                                input.headers
                                :
                                undefined
                        )
                    );

                headers.set(
                    "X-CSRF-Token",
                    window.FitHealthCsrfToken
                );

                options.headers =
                    headers;
            }

            return nativeFetch(
                input,
                options
            );
        };
})();


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

        window.FitHealthCsrfToken =
            data.csrfToken
            ||
            null;


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