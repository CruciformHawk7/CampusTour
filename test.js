var values = require('./testval.json');
//console.log(values);
values.forEach(i => {
    console.log(i.ID);
    console.log(i.Target);
    console.log(i.Direction);
    console.log(i.Asset);
});

// function fetchData() {
//     // ¯\_(ツ)_/¯
//     values.forEach(i => {
//         var id = i.ID;
//         var target = i.Target;
//         var direction = i.Direction;
//         var asset = i.Asset;
//     })
// }