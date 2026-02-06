import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@etukas.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'admin',
        phone: '9876543210',
        savedAddresses: []
    },
    {
        name: 'John Seller',
        email: 'seller@etukas.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'seller',
        phone: '9876543211',
        savedAddresses: []
    },
    {
        name: 'Jane Customer',
        email: 'customer@etukas.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'customer',
        phone: '9876543212',
        savedAddresses: []
    }
];

export default users;
