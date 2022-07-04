let myHeaders = new Headers();
myHeaders.append("accept", "application/json");
myHeaders.append(
  "X-API-Key",
  "cXUbD1EkKAxsnYtmu9t1DsWRaoZ18oJwMRAL64NiZQLJrGZKNoouXLwrQaZu7vZG"
);

let requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

let mySet = new Set();
let url =
  "https://deep-index.moralis.io/api/v2/0x777bef8D44c5EfE02F3C0a705EC3bff613C82a9C/nft?chain=eth&format=decimal";
fetch(url, requestOptions)
  .then((response) => response.json())
  .then(async (e) => {
    e.result.map((e) => mySet.add(e.token_address));
    let cursor = e.cursor;
    while (cursor) {
      let res = await fetch(`${url}&cursor=${cursor}`, requestOptions);
      res = await res.json();
      res.result.map((e) => mySet.add(e.token_address));
      cursor = res.cursor;
    }
    let slug,
      floor_price = 0,
      seven_day_average_price = 0;
    const myFun = async (em) => {
      let e = await fetch(`https://api.opensea.io/api/v1/asset_contract/${em}`);
      e = await e.json();
      try {
        let cc = await fetch(
          `https://api.opensea.io/api/v1/collection/${e.collection.slug}`
        );
        let ccc = await cc.json();
        Math.min(
          ccc.collection.stats.floor_price,
          ccc.collection.stats.seven_day_average_price
        ) > Math.min(floor_price, seven_day_average_price) &&
          ([
            slug,
            floor_price,
            seven_day_average_price,
            seven_day_average_price,
          ] = [
            e.collection.slug,
            ccc.collection.stats.floor_price,
            ccc.seven_day_average_price,
          ]);
      } catch (e) {}
    };
    await Promise.all([...mySet].map(myFun));

    console.log(slug, floor_price);
  });
