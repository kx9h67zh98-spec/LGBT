/* Theme */

function updateTheme() {

    const vietnamHour =
        Number(
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone:
                        "Asia/Ho_Chi_Minh",

                    hour:
                        "2-digit",

                    hour12:
                        false
                }
            ).format(
                new Date()
            )
        );


    const html =
        document.documentElement;


    const greeting =
        document.getElementById(
            "greeting"
        );


    /* Light / Dark */

    if (
        vietnamHour < 12
    ) {

        html.setAttribute(
            "data-bs-theme",
            "light"
        );

    }

    else {

        html.setAttribute(
            "data-bs-theme",
            "dark"
        );

    }


    if (!greeting) {

        return;

    }


    greeting.classList.remove(
        "greeting-morning",
        "greeting-afternoon",
        "greeting-night"
    );


    /* Morning */

    if (
        vietnamHour < 12
    ) {

        greeting.innerHTML = `
            <i class="bi bi-sun-fill me-2"></i>
            Good morning
        `;


        greeting.classList.add(
            "greeting-morning"
        );

    }


    /* Afternoon */

    else if (
        vietnamHour < 18
    ) {

        greeting.innerHTML = `
            <i class="bi bi-cloud-sun-fill me-2"></i>
            Good afternoon
        `;


        greeting.classList.add(
            "greeting-afternoon"
        );

    }


    /* Night */

    else {

        greeting.innerHTML = `
            <i class="bi bi-moon-stars-fill me-2"></i>
            Good night
        `;


        greeting.classList.add(
            "greeting-night"
        );

    }

}



/* Start Theme */

updateTheme();


setInterval(
    updateTheme,
    60000
);



/* Mobile Navbar */

const navbarMenu =
    document.getElementById(
        "navbarMenu"
    );


const navLinks =
    document.querySelectorAll(
        "#navbarMenu .nav-link, #navbarMenu .btn"
    );


navLinks.forEach(

    function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    navbarMenu
                    &&
                    navbarMenu.classList.contains(
                        "show"
                    )
                ) {

                    const collapse =
                        bootstrap.Collapse
                            .getOrCreateInstance(
                                navbarMenu
                            );


                    collapse.hide();

                }

            }
        );

    }

);



/* Navbar Shadow */

const navbar =
    document.querySelector(
        ".navbar"
    );


function updateNavbarShadow() {

    if (!navbar) {

        return;

    }


    if (
        window.scrollY > 20
    ) {

        navbar.classList.add(
            "shadow-sm"
        );

    }

    else {

        navbar.classList.remove(
            "shadow-sm"
        );

    }

}


window.addEventListener(
    "scroll",
    updateNavbarShadow
);


updateNavbarShadow();



/* Home Navigation */

const homeNavLinks =
    document.querySelectorAll(
        '.navbar .nav-link[href^="#"]'
    );


function updateActiveNavigation() {

    const currentPosition =
        window.scrollY + 140;


    homeNavLinks.forEach(

        function (link) {

            const target =
                document.querySelector(
                    link.getAttribute(
                        "href"
                    )
                );


            if (!target) {

                return;

            }


            const start =
                target.offsetTop;


            const end =
                start
                +
                target.offsetHeight;


            if (
                currentPosition >= start
                &&
                currentPosition < end
            ) {

                homeNavLinks.forEach(

                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }

                );


                link.classList.add(
                    "active"
                );

            }

        }

    );

}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


updateActiveNavigation();