var ParserApi = {
    search: function (q) {
        return $.ajax({
            type: "POST",
            url: 'http://localhost:8090/ua/parse',
            data: { ua: q }
        });
    }
}