const { rejects } = require('assert');
var axios = require('axios');
var cheerio = require('cheerio');
const { checkServerIdentity } = require('tls');
//limit the number of search.(first top results.)
const limit_search = 10;

async function getPrice() {
    try {
        //grab the html string from this website.
        const siteurl = "https://coinmarketcap.com/";
        const { data } = await axios({
            method: "GET",
            url: siteurl,
        })
        const $ = cheerio.load(data);
        //The elemselector for the currency on the page.
        const elemSelector = '#__next > div > div.sc-57oli2-0.dEqHl.cmc-body-wrapper > div > div > div.tableWrapper___3utdq > table > tbody > tr';
        const cryptoArr = [];
        // The names for each variable used in the arr.
        const key = [
            'rank',
            'name',
            'price',
            'day',
            'week',
            'marketCap',
            'volume',
            'circulatingSupply'
        ]
        //This will able to call out each of the currency. will loop each element.
        $(elemSelector).each((parentID, parentElem) => {
            let keyIdx = 0;
            const cryptoobj = {};
            if (parentID < limit_search) {
                $(parentElem).children().each((childIdx, childElem) => {
                    let tdValue = $(childElem).text();
                    if (tdValue) {
                        cryptoobj[key[keyIdx++]] = tdValue;
                    }
                })
                cryptoArr.push(cryptoobj);
                //console.log(cryptoArr);
            }
        })
        return cryptoArr;
    } catch (error) {
        console.log("ERROR: " + error);
    }

}

//export the function so that other js file can access it.
module.exports.getPrices = function () {
    return new Promise((resolve, reject) => {
        const arr = getPrice();
        if (arr) {
            resolve(arr);
        }
        else
            reject("ERROR");
    })
};
