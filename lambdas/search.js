const jishoApi = require("unofficial-jisho-api");
const { parse } = require("url");

module.exports = async (req, res) => {
    let token = "";

    if (req.params && req.params.token) {
        token = req.params.token;
    } else {
        const { query } = parse(req.url, true);
        token = query.token;
    }

    const jisho = new jishoApi();

    try {
        const result = await jisho.searchForExamples(token);
        if (!result) {
            res.end(JSON.stringify({}));
            return;
        }
        res.end(JSON.stringify(result.results));
    } catch (e) {
        console.log(e);
        res.end(JSON.stringify({}));
    }
};
