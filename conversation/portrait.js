 const portrait = "\t\t\t\t                     ..                     \n" +
 "\t\t\t\t                ./ossoo++/:                 \n" +
 "\t\t\t\t              :ssso+++/o++++/.              \n" +
 "\t\t\t\t            -sssoo++//:+/:::///             \n" +
 "\t\t\t\t           +hyso++//::/:::::-///.           \n" +
 "\t\t\t\t          yhyss+o/:::----.--+:::/:          \n" +
 "\t\t\t\t        .yhdysy++/:----...--::-/:::         \n" +
 "\t\t\t\t        hhdhyyo+//:--./.  ./+/+/::/:        \n" +
 "\t\t\t\t       ydhhyss+/o+:--.-..  .:///://+:       \n" +
 "\t\t\t\t      odddyyss++/::----....:-//o-.-/+-      \n" +
 "\t\t\t\t     :mdhhyyso++/::-.......:-:-+/-://+      \n" +
 "\t\t\t\t     hmdhhyyooo//::-.---...-.+---:-.:+:     \n" +
 "\t\t\t\t    /mddhhyyso+/::/s.-.-/:-.  -:::.::++     \n" +
 "\t\t\t\t    hmmdhhhhso++/:::::::-.:.-::::::/ooo+    \n" +
 "\t\t\t\t   .Ndmdhdyhsds+//::::o//::/d+:o+/::+sss    \n" +
 "\t\t\t\t   /Nmddhhhdysoo+////md:/:::.-/+//://+ss    \n" +
 "\t\t\t\t   oNmddhhyysssooo++//::-:://:o+::/ss+oo.   \n" +
 "\t\t\t\t   oNmdmdhyyyysssso+////:::/+++::///+++o-   \n" +
 "\t\t\t\t   +Nmmddhdyydyhsssoh/o/:::::/+::/o+++yy.   \n" +
 "\t\t\t\t   .NNmmddhhyyhssss+++++//::://:oys+osyo    \n" +
 "\t\t\t\t    yNNNmdddyyyhsss++////yy+::++sdoooss:    \n" +
 "\t\t\t\t    .mNNNmddhyyysyss+++++o+/++yymhossso     \n" +
 "\t\t\t\t     -NNNNmdhhyyhsysssoo+++osyyososyys      \n" +
 "\t\t\t\t      -NNmmmddhdhyyyyyysssssdysmhyyys       \n" +
 "\t\t\t\t       .hNNNmmmmddhhmdhhyyyyhhyhhhho        \n" +
 "\t\t\t\t         /mNNNmmmddddhhdmddmhhddhy-         \n" +
 "\t\t\t\t           /hNNNNmmmmmdddddmddms-           \n" +
 "\t\t\t\t              /sdNNmNNNmmmmds:              \n" +
 "\t\t\t\t                  .-://:-.                  \n";


module.exports = (controller)=> {
  controller.hears("portrait", "", (message) => {
        message.channel.send(portrait, { code: true });  
  }); 
}