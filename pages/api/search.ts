import { NextApiHandler } from "next";
import algolia from "algoliasearch";

const client = algolia(process.env.ALGOLIA_ID as string, process.env.ALGOLIA_SECRET as string);

const SearchApi: NextApiHandler = async(req, res) => {
  if (req.method !== "POST") {
    return res.status(404).send({error: true, results: []});
  }

  if (!!req.body) {
    const query = JSON.parse(req.body)
    const search = query.search;

    const queries = [{
      indexName: "court_cases",
      query: search,
      params: {
        hitsPerPage: 10
      }
    }, {
      indexName: "evidence",
      query: search,
      params: {
        hitsPerPage: 10,
      }
    }];

    const find = await client.multipleQueries(queries);

    const results: any[] = [];

    find.results.filter(o => o.hits.length).map(result => {
      result.hits.map(hit => {
        results.push({
          ...hit,
          _index_name: result.index
        })
      })
    })

    return res.status(201).send({results})
  }

  return res.send({results: []})
}

export default SearchApi;