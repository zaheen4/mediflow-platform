const validEquipment = {
    name: "Valid Equipment",
    description: "A valid item",
    price: 100,
    quantity: 10,
    image_url: "http://example.com/img.jpg",
};

const missingNameEquipment = {
    price: 100,
    quantity: 10,
};

const negativePriceEquipment = {
    name: "Negative Price",
    price: -5,
    quantity: 10,
};

const negativeQuantityEquipment = {
    name: "Negative Quantity",
    price: 100,
    quantity: -1,
};

module.exports = { validEquipment, missingNameEquipment, negativePriceEquipment, negativeQuantityEquipment };
