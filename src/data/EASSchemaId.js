// src/data/EASSchemaId.js
const schemaIdList = [
  {
    name: "curatorLevel",
    // schemaId: "0x43cf08eb1faa7ce44af68069cf8c75d7195f8d2fb5bebd0516e254a4dce9f10b",
    schemaId: "0x8df3f8e093835a3eab036f856de9a684041a0ec4599eaa38d2c7051d8303d3e7",
  },
  {
    name: "curatorPoint",
    schemaId: "0xd99e3ecbf2db4e794993c2ecc397a532ec455e28432adab72545c2bf4659bfb9",
  },
  {
    name: "purchaserPoint",
    schemaId: "0x55c9b190cb73535713629df9c6f749d19aace1ea2854ee8eae27268c1b6f30d7",
  },
  {
    name: "directorPoint",
    schemaId: "0x0aab61cc821be6f6625613f911e2bd7cc426d8e40f4851c49cfb7a89e7b63cba",
  },
  {
    name: "curatorRevenue",
    schemaId: "0x93c4fddb3bb65f779d17274cac86e007d61fe50801b449164f33abff7b191989",
  },
  {
    name: "purchaseTicket",
    schemaId: "0xa030fd8da561af5edd2590ce0e1458c2c175fdc41ba68130ecf017e2b13cc880",
  },
  {
    name: "proofOfWatched",
    // schemaId: "0x70b3480d4a2843216215cf17bcdad8e0116cd590c607c5639fb7d8cf851aab73",
    schemaId: "0x1322773af553519857376e6d0498d7d7361c3afad989c75e6658b64e63b0ad21",
  },
];

function getSchemaId(name) {
  return schemaIdList.find(schemaId => schemaId.name === name).schemaId || null;
}

export { schemaIdList, getSchemaId };
