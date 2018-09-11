/**
 * рендерит sitemap.xml
 *
 * @module sitemap
 *
 * Created by Evgeniy Malyarov on 05.09.2018.
 */

const xml = require('fs').readFileSync(require.resolve('./sitemap.xml'), 'utf8');
const ram = require('../../src/metadata/ram');
const selector = {
  selector: {
    class_name: 'cat.articles',
    date: {$gt: null},
    search: {$gt: null},
    published: true
  },
  fields: ['id', 'date', 'tags'],
  limit: 1000,
};
const su = process.env.SERVER_URL;

function row({id, date, tags}) {
  // находим tag
  const tag = tags && tags.length && ram.find((row) => {
    return row._id.indexOf(tags[0]) !== -1;
  });
  // находим group
  const category = tag && ram.find((row) => {
    return row._id.indexOf(tag.category) !== -1;
  });
  let cat = category.predefined_name;
  if(!cat) {
    return '';
  }
  if(!cat.endsWith('s')) {
    cat += 's';
  }
  return category ? `<url>
    <loc>${su}/${cat}/${id}</loc>
    <lastmod>${date.split('T')[0]}</lastmod>
  </url>` : '';
}

module.exports = function (req, res, next, db) {
  if(!req.url.match(/^\/sitemap\.xml/)) {
    return next();
  }

  // бежим по всем статьям
  db.find(selector)
    .then(({docs}) => {
      let rows = '';
      for(const doc of docs) {
        rows += row(doc);
      }
      res
        .set('Content-Type', 'application/xml; charset=utf-8')
        .send(xml.replace('</urlset>', `${rows}\n</urlset>`));
    });
}
