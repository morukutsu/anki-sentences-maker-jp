const jishoApi = require("unofficial-jisho-api");
const { parse } = require("url");

module.exports = async (req, res) => {
    const { query } = parse(req.url, true);
    const { token } = query;
    const jisho = new jishoApi();

    try {
        const result = await jisho.searchForExamples(token);
        if (!result) {
            res.end(JSON.stringify({}));
            return;
        }
        console.log(result);
        res.end(JSON.stringify(result.results));
    } catch (e) {
        console.log(e);
        res.end(JSON.stringify({}));
    }
};
