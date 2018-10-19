use myDatabase;
db.createCollection("userInfo");
db.userInfo.insert({ "_id" : ObjectId("5bc7eee9492fe31548c2ead8"), "username" : "Alice", "password" : "016195548d733ef51a8374c43e670b7a66a45fa9eedd260d3fee5cdb3fbb84516397d2ed2a7e5f508f8fbcb92d79ae8d4fd4f25521c4bb26eab597a2f853c7b3", "salt" : "2b03a75823681075" });
db.userInfo.insert({ "_id" : ObjectId("5bc7eef4492fe31548c2ead9"), "username" : "Bob"  , "password" : "d2d4404888c6ac49920901075a58b58463a8f5b3a690dfb9f0bd01d45e3e6415f900b3fdad0980548740a76da32c4c1627b46d3291bd5be89b6a70be3ee8c587", "salt" : "70cbe4e5a6d1e608" });