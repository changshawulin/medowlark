var fortunes = [
    "Conquer your fears or they will conquer you",
    "Rivers needs springs",
    "Do not fear that you don`t known",
    "you will have a plesant surprise",
    "Whenever possible, keep it possible"
];

exports.getFortune = () => fortunes[Math.floor(Math.random() * fortunes.length)];