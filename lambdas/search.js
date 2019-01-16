const jishoApi = require("unofficial-jisho-api");

module.exports = async (req, res) => {
    const jisho = new jishoApi();

    try {
        const result = await jisho.searchForExamples(req.params.token);
        if (!result) {
            res.json({});
            return;
        }

        res.json(result.results);
    } catch (e) {
        res.json({});
    }
};
