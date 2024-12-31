const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
// app.use(cors(
//     {
//         origin: "",
//     }
// ));

app.use(cors(
));

app.get("/", (req, res) => {
    res.render("Howdy");
});

app.listen(port, () => {
    console.log('Server started on port ${port}');
});



