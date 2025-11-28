rs.initiate({
    _id: "rs0",
    version: 1,
    members : [
        {_id : 0, host: "mongodb:27017"}
    ]
});

while(true){
    const status = rs.status();
    if(status.ok === 1){
        console.log("Replice Set initialized successfully!");
        break;
    }
}