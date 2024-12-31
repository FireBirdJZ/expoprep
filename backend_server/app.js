const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
// index.use(cors(
//     {
//         origin: "",
//     }
// ));

app.use(cors(
));

app.get("/", (req, res) => {
    res.send("Howdy");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});



