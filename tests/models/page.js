const assert = require('chai').assert;
const Page = require('../../models/page');

describe('Database \'pages\' collection unit test', function() {
  describe('Pages in db are valid', function() {
    it('Should have all unique page_ids', async function() {
      let pages = await Page.find({});
      let duplicate = false;
      for (let i = 0; i < pages.length; i++) {
        let p = pages[i];
        for (let j = i + 1; j < pages.length; j++) {
          if (pages[j].page_id === pages[i].page_id) {
            duplicate = true;
            break;
          }
        }
        if (duplicate)
          break;
      }
      assert(!duplicate, 'Database contains multiple pages with the same page_id');
    })
  });
});
