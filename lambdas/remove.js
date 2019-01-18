const Database = require("./api/Database");

module.exports = async (req, res) => {
    try {
        const cards = await Database.removeCard(req.params.id);
        res.json({});
    } catch (e) {
        console.log(e);
        res.json({});
    }
};
