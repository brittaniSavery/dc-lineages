import nextConnect from "next-connect";
import database from "../../../middleware/database";
import { getMongoQueryForFind } from "../../../lib/helpers";

const handler = nextConnect();
handler.use(database);

/** GET: All lineage data based on search criteria */
handler.get(async (req, res) => {
  let query = getMongoQueryForFind(req.query);

  //limiting return for load management
  const limit =
    req.query.limit && req.query.limit < 200 ? req.query.limit : 200;

  const lineages = await req.db
    .collection("lineages")
    .find(query)
    .sort({ "male.breed": 1, "female.breed": 1, generation: 1 })
    .skip(req.query.skip || 0)
    .limit(limit)
    .project({
      generation: 1,
      type: 1,
      male: 1,
      female: 1,
      owner: 1,
      sample: 1,
    })
    .toArray();

  res.json(lineages);
});

handler.post(async (req, res, next) => {
  try {
    const db = req.db.collection("lineages");
    let result = await db.insertOne(req.body);
    res.status(201);
    res.json({ lineageId: result.insertedId });
  } catch (error) {
    next(Error(error));
  }
});

export default handler;
