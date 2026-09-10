const express = require(
    "express"
);

const path = require(
    "path"
);


const app =
    express();


const PORT =
    3000;


/* JSON */

app.use(
    express.json()
);


/* Frontend */

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


/* Test API */

app.get(
    "/api/test",
    function (req, res) {

        res.json({
            message:
                "FitHealth backend is working"
        });

    }
);


/* Server */

app.listen(
    PORT,
    function () {

        console.log(
            `FitHealth running at http://localhost:${PORT}`
        );

    }
);