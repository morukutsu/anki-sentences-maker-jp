const jishoApi = require("unofficial-jisho-api");
const { parse } = require("url");

module.exports = async (req, res) => {
    const { query } = parse(req.url, true);
    const { token } = query;
    console.log(token);
    console.log(query);
    const jisho = new jishoApi();

    try {
        const result = await jisho.searchForExamples(token);
        if (!result) {
            res.json({});
            return;
        }

        res.json(result.results);
    } catch (e) {
        console.log(e);
        res.json({});
    }
};
