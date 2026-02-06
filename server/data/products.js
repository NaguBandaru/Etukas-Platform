const products = [
    {
        title: 'UltraTech Cement (50kg)',
        description: 'High quality regular Portland cement for all construction needs.',
        type: 'product',
        category: 'cement',
        price: 380,
        unit: 'bag',
        stock: 500,
        brand: 'UltraTech',
        location: {
            type: 'Point',
            coordinates: [78.4867, 17.3850], // Hitech City approx (Hyderbad example)
            formattedAddress: 'Hyderabad, Telangana'
        },
        images: ['https://5.imimg.com/data5/SELLER/Default/2023/1/IE/QY/WO/3646702/ultratech-cement-50-kg-500x500.jpg']
    },
    {
        title: 'Red Bricks (Clay)',
        description: 'Standard size red clay bricks, burnt and durable.',
        type: 'product',
        category: 'bricks',
        price: 8,
        unit: 'piece',
        stock: 10000,
        location: {
            type: 'Point',
            coordinates: [78.4900, 17.3900],
            formattedAddress: 'Secunderabad, Telangana'
        },
        images: ['https://5.imimg.com/data5/ANDROID/Default/2021/3/MZ/QO/XV/125303723/product-jpeg-500x500.jpg']
    },
    {
        title: 'River Sand (Tractor Load)',
        description: 'Fine river sand suitable for plastering and concrete.',
        type: 'product',
        category: 'sand',
        price: 4500,
        unit: 'load',
        stock: 10,
        location: {
            type: 'Point',
            coordinates: [78.4700, 17.3700],
            formattedAddress: 'Kukatpally, Telangana'
        },
        images: ['https://www.buildersmart.in/uploads/products/river-sand2.jpg']
    }
];

export default products;
