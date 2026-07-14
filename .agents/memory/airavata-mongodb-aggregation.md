---
name: Airavata MongoDB aggregation ObjectId casting
description: Mongoose does not auto-cast string IDs to ObjectId in aggregation pipelines — must do it explicitly.
---

# MongoDB Aggregation ObjectId Casting

In standard Mongoose queries (`.find()`, `.findOne()`) a string userId is automatically cast to ObjectId. In aggregation pipelines (`$match`) this does NOT happen — the comparison silently fails and returns zero results.

**Rule:** Any `$match` stage that filters on an ObjectId field using a value coming from `req.user!.userId` (a string from the JWT payload) must wrap it explicitly:

```ts
{ $match: { userId: new mongoose.Types.ObjectId(req.user!.userId) } }
```

**Why:** Discovered when the group memberCount aggregation returned 0 for all groups even after contacts were assigned.

**How to apply:** Any future route that uses `.aggregate()` with userId, contactId, campaignId, etc. from a string source must cast first. Regular `.find({ userId: req.user!.userId })` calls are fine as-is.
