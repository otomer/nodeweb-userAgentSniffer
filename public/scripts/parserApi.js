var ParserApi = {
    search: function (q) {
        return $.ajax({
            type: "POST", 
            url: 'https://uasniffer.herokuapp.com/ua/parse',
            data: { ua: q }
        });
    }
}

 