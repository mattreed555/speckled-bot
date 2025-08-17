const servers = {
      "778430360634654730":"mm",
      "780070500331683870":"mm", // test server 1
      "846155051059642408": "mm"//"mrdev" // test server 2
    };


const serverFriendlyNames = {
      "778430360634654730":"Midnight Makers Society",
      "780070500331683870":"KCMR Test Server", // test server 1
      "846155051059642408":"Extra Test Server"//"mrdev" // test server 2
    };

module.exports = {
  getCustomGroup: guildid => servers[guildid],
  getFriendlyNameMap: guildid => serverFriendlyNames[guildid],
}