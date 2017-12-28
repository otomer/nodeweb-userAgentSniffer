var ParserApi = {
    search: function (q) {
        return $.ajax({
            type: "POST", 
            url: 'https://uasniffer.herokuapp.com:39446/ua/parse',
            data: { ua: q }
        });
    }
}

 