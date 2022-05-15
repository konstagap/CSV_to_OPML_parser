const csv = require('csv-parser');
const fs = require('fs');
const categories = {};

const groupByCategory = feed => {
  if (!categories[feed.Category]) {
    categories[feed.Category] = [feed];
  } else {
    categories[feed.Category].push(feed);
  }
};

const writeFeedsToFile = () => {
  const opml = generateOpml(categories);
  fs.writeFile('./result.opml', opml, function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
};

const generateOpml = categories => {
  let header = `<?xml version='1.0' encoding='UTF-8' ?>
      <opml version="1.0">
        <head>
          <title>Export from Brave Browser</title>
        </head>\n`;
  let body = `<body>\n`;
  const footer = `\n</body>\n</opml>`;

  for (const category in categories) {
    let group = `<outline text="${category}" title="${category}">\n`;
    categories[category].forEach(feed => {
      group += `<outline text="${feed.Title}" title="${feed.Title}" description="${feed.Title}" xmlUrl="${feed.Feed}" type="rss" />\n`;
    });
    group += `</outline>\n`;
    body += group;
  }

  return header + body + footer;
};

fs.createReadStream('./example/feeds.csv')
  .pipe(csv())
  .on('data', groupByCategory)
  .on('end', writeFeedsToFile);
