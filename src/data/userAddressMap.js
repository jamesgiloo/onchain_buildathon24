// src/data/userAddressMap.js
// const userList = [
//     {
//       name: "Ben",
//       address: "0xdC518EE95b9Ed37f4B6a920A339d3e620d78F054",
//       Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/Ben.svg"
//     },
//     {
//       name: "Henry",
//       address: "0x94bdDA75E1951652876d9d48956ebfb836590DEE",
//       Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/Henry.svg"
//     },
//     {
//       name: "James",
//       address: "0x4362d1Bb028E70A345060382eea9aC0b350688b6",
//       Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/James.svg"
//     },
//     {
//       name: "Kevin",
//       address: "0xBF5e85f61C8aa661833c5168f5d4a944007E6332",
//       Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/Kevin.svg"
//     },
//     {
//       name: "Marvin",
//       address: "0x52F382a52A027803F20b59DcfFf06140EF6e26aF",
//       Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/Marvin.svg"
//     },
//     {
//       name: "test1",
//       address: "0xd7821AEA923c7c1834B6B3C2e38FD156895ad904",
//       Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmXjhRSFfMSvPmX129p51qjPo4rqVXEWfs962DqsPndgmg"
//     },
//   ];

  const userList = [
    {
      name: "Ben",
      address: "0xdC518EE95b9Ed37f4B6a920A339d3e620d78F054",
      Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/Ben.svg"
    },
    {
      name: "Henry",
      address: "0xF76dEfD4ee2e695cA8339b0fA83948158b299635",
      Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/Henry.svg"
    },
    {
      name: "James",
      address: "0x0722a495c2197d35fBb68370e66eB49B49D8237B",
      Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/James.svg"
    },
    {
      name: "Kevin",
      address: "0xBF5e85f61C8aa661833c5168f5d4a944007E6332",
      Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/Kevin.svg"
    },
    {
      name: "Marvin",
      address: "0x52F382a52A027803F20b59DcfFf06140EF6e26aF",
      Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmS1mDTVeD77qhaAYKz9TfFdFCJ2tnEzt748Fq7KyLtgED/Marvin.svg"
    },
    {
      name: "test1",
      address: "0xd7821AEA923c7c1834B6B3C2e38FD156895ad904",
      Icon: "https://scarlet-hilarious-booby-67.mypinata.cloud/ipfs/QmXjhRSFfMSvPmX129p51qjPo4rqVXEWfs962DqsPndgmg"
    },
  ];

  function getUser(address) {
    return userList.find(user => user.address === address) || null;
  }

export { userList, getUser };
