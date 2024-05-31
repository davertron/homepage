const axios = require("axios");

async function main() {
    const response = await axios.get('http://fullstridestaging.com/schedule_nf.php?league=1&programme_abbr=SRC');
    console.log(`response: ${JSON.stringify(response.data, null, 2)}`);
}

main();