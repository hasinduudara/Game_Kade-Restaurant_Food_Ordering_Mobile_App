export const categories = [
    { id: 1, name: 'Rice', icon: 'restaurant' },
    { id: 2, name: 'Kottu', icon: 'fast-food' },
    { id: 3, name: 'Burgers', icon: 'nutrition' },
    { id: 4, name: 'Drinks', icon: 'beer' },
];

export const foodItems = [
    // --- Category 1: Rice ---
    {
        id: 1,
        categoryId: 1,
        name: 'Vegetable Fried Rice',
        price: 'Rs. 600',
        rating: 4.2,
        image: 'https://i.pinimg.com/1200x/2d/96/30/2d9630cc1b2ed564e1b7ab2f36951fb0.jpg',
        description: 'Classic Sri Lankan style vegetable fried rice.'
    },
    {
        id: 2,
        categoryId: 1,
        name: 'Egg Rice',
        price: 'Rs. 750',
        rating: 4.3,
        image: 'https://i.pinimg.com/1200x/da/eb/96/daeb96174db243f400c727e5b0c6b904.jpg',
        description: 'Fried rice with scrambled eggs and vegetables.'
    },
    {
        id: 3,
        categoryId: 1,
        name: 'Red Rice & Curry',
        price: 'Rs. 450',
        rating: 4.5,
        image: 'https://i.pinimg.com/1200x/e7/45/6d/e7456d692309d224616c42804b99cf12.jpg',
        description: 'Traditional red rice with 7 vegetable curries and fish.'
    },
    {
        id: 4,
        categoryId: 1,
        name: 'Chicken Fried Rice (Sri Lanka Style)',
        price: 'Rs. 900',
        rating: 4.6,
        image: 'https://i.pinimg.com/736x/ac/11/a7/ac11a70c5c90d161be1a3b7442aa6bee.jpg',
        description: 'Spicy fried rice with local chicken curry flavor.'
    },
    {
        id: 5,
        categoryId: 1,
        name: 'Fish Rice',
        price: 'Rs. 800',
        rating: 4.1,
        image: 'https://i.pinimg.com/1200x/5d/ec/98/5dec983e4c5d817673357daa4673132c.jpg',
        description: 'Fried rice served with spicy fish devilled.'
    },
    {
        id: 6,
        categoryId: 1,
        name: 'Special Nasi Goreng',
        price: 'Rs. 1800',
        rating: 4.9,
        image: 'https://i.pinimg.com/1200x/9b/3e/44/9b3e444fb0111acc4c1f85aac9f4f167.jpg',
        description: 'Indonesian style rice with chicken, prawns, and sunny-side-up egg.'
    },
    {
        id: 7,
        categoryId: 1,
        name: 'Hyderabadi Chicken Biryani',
        price: 'Rs. 2200',
        rating: 5.0,
        image: 'https://i.pinimg.com/1200x/87/4e/b9/874eb9bef63629c19c327cf127fcda37.jpg',
        description: 'Aromatic basmati rice cooked with spices and chicken.'
    },
    {
        id: 8,
        categoryId: 1,
        name: 'Seafood Mixed Rice',
        price: 'Rs. 1500',
        rating: 4.8,
        image: 'https://i.pinimg.com/736x/eb/74/64/eb746441a00966a782d69a4c7e633214.jpg',
        description: 'Premium basmati rice loaded with prawns, calamari, and fish.'
    },
    {
        id: 9,
        categoryId: 1,
        name: 'Thai Pineapple Rice',
        price: 'Rs. 1950',
        rating: 4.7,
        image: 'https://i.pinimg.com/1200x/c8/9e/cf/c89ecf939fbc267907b9f91306482d6a.jpg',
        description: 'Sweet and savory Thai fried rice served in a pineapple shell.'
    },
    {
        id: 10,
        categoryId: 1,
        name: 'Mongolian Mixed Rice',
        price: 'Rs. 2100',
        rating: 4.8,
        image: 'https://i.pinimg.com/1200x/41/9b/43/419b43c8ea9bb3e21dfb54703341b6cb.jpg',
        description: 'Stir-fried rice with mixed meats and a spicy Mongolian sauce.'
    },

    // --- Category 2: Kottu ---
    {
        id: 11,
        categoryId: 2,
        name: 'Vegetable Kottu',
        price: 'Rs. 700',
        rating: 4.2,
        image: 'https://i.pinimg.com/1200x/f3/c5/f2/f3c5f27cf9e53a83758ea8f3a67c89fd.jpg',
        description: 'Spicy chopped roti with carrots, leeks, and onions.'
    },
    {
        id: 12,
        categoryId: 2,
        name: 'Egg Kottu',
        price: 'Rs. 850',
        rating: 4.4,
        image: 'https://i.pinimg.com/1200x/54/72/c6/5472c6dc3938bcef3c5891603f18cee7.jpg',
        description: 'Chopped roti stir-fried with eggs and spicy curry gravy.'
    },
    {
        id: 13,
        categoryId: 2,
        name: 'Chicken Kottu',
        price: 'Rs. 1100',
        rating: 4.6,
        image: 'https://i.pinimg.com/1200x/2a/4c/7e/2a4c7e25a4be3edd84b3f4f8ef981b9c.jpg',
        description: 'The classic Sri Lankan chicken kottu with spicy gravy.'
    },
    {
        id: 14,
        categoryId: 2,
        name: 'Roast Chicken Kottu',
        price: 'Rs. 1300',
        rating: 4.7,
        image: 'https://i.pinimg.com/1200x/f3/67/6c/f3676ceaf6c8e5b2cdfa4c67044c2adc.jpg',
        description: 'Kottu served with a piece of roast chicken on top.'
    },
    {
        id: 15,
        categoryId: 2,
        name: 'Dolphin Kottu',
        price: 'Rs. 1400',
        rating: 4.8,
        image: 'https://i.pinimg.com/1200x/d6/d0/75/d6d0759eea5d87f87488272a9fa5eb71.jpg',
        description: 'Large chunks of roti mixed with creamy chicken curry.'
    },
    {
        id: 16,
        categoryId: 2,
        name: 'Special Cheese Kottu',
        price: 'Rs. 1900',
        rating: 4.9,
        image: 'https://i.pinimg.com/1200x/ef/4f/5a/ef4f5a9af97e9615b1f89c41eaaff984.jpg',
        description: 'Creamy kottu loaded with mozzarella cheese and roast chicken.'
    },
    {
        id: 17,
        categoryId: 2,
        name: 'Seafood Kottu',
        price: 'Rs. 2300',
        rating: 4.8,
        image: 'https://i.pinimg.com/736x/5d/e3/50/5de3504c22fbfb8df0930b2b22ef0b7d.jpg',
        description: 'Kottu with prawns, calamari, and fish in a rich sauce.'
    },
    {
        id: 18,
        categoryId: 2,
        name: 'Mutton Kottu',
        price: 'Rs. 2600',
        rating: 5.0,
        image: 'https://i.pinimg.com/736x/fc/6e/c5/fc6ec55b2f335b08838c8dc09800fdc0.jpg',
        description: 'Spicy kottu with tender mutton pieces.'
    },
    {
        id: 19,
        categoryId: 2,
        name: 'Masala Prawn Kottu',
        price: 'Rs. 2400',
        rating: 4.9,
        image: 'https://i.pinimg.com/736x/21/34/c8/2134c890592f7c9e3e4ee65bd1d1554f.jpg',
        description: 'Indian masala spiced kottu with jumbo prawns.'
    },
    {
        id: 20,
        categoryId: 2,
        name: 'String Hopper Kottu',
        price: 'Rs. 1800',
        rating: 4.7,
        image: 'https://mrandmrschefspalmy.co.nz/cdn/shop/files/rn-image_picker_lib_temp_14c74e4d-0528-4e46-ad64-80b8b0372bc4_1080x.jpg?v=1705978718',
        description: 'Kottu made with string hoppers, chicken, and cheese.'
    },

    // --- Category 3: Burgers ---
    {
        id: 21,
        categoryId: 3,
        name: 'Veggie Bun Burger',
        price: 'Rs. 400',
        rating: 4.0,
        image: 'https://i.pinimg.com/1200x/27/ab/5e/27ab5edd0885b823023a2b5ba47a1f04.jpg',
        description: 'Simple bun with a vegetable patty and sauce.'
    },
    {
        id: 22,
        categoryId: 3,
        name: 'Egg Burger',
        price: 'Rs. 500',
        rating: 4.2,
        image: 'https://i.pinimg.com/1200x/8e/e3/08/8ee3089ff220fda48c103b136b2640b6.jpg',
        description: 'Bun with a fried egg, onions, and sauce.'
    },
    {
        id: 23,
        categoryId: 3,
        name: 'Chicken Burger',
        price: 'Rs. 750',
        rating: 4.4,
        image: 'https://i.pinimg.com/1200x/b7/8f/91/b78f91b8388944105366e4f04fe3b8da.jpg',
        description: 'Deep fried chicken patty in a sesame bun.'
    },
    {
        id: 24,
        categoryId: 3,
        name: 'Fish Burger',
        price: 'Rs. 700',
        rating: 4.3,
        image: 'https://i.pinimg.com/736x/a7/5a/f6/a75af60af918e8669071e6db40124460.jpg',
        description: 'Spicy fish patty burger with salad.'
    },
    {
        id: 25,
        categoryId: 3,
        name: 'Sausage Burger',
        price: 'Rs. 650',
        rating: 4.2,
        image: 'https://i.pinimg.com/736x/2e/85/08/2e85086e1a8ce786bd3757313f24574c.jpg',
        description: 'Burger bun filled with grilled chicken sausages.'
    },
    {
        id: 26,
        categoryId: 3,
        name: 'Double Cheese Burger',
        price: 'Rs. 1600',
        rating: 4.9,
        image: 'https://i.pinimg.com/736x/95/e3/04/95e304189fde8dc35c11fa4589c0a9ca.jpg',
        description: 'Two beef patties with double cheddar cheese.'
    },
    {
        id: 27,
        categoryId: 3,
        name: 'Crispy Zinger Burger',
        price: 'Rs. 1450',
        rating: 4.8,
        image: 'https://i.pinimg.com/736x/e4/6c/2d/e46c2dfed1547c70463d8a5612b8555a.jpg',
        description: 'Spicy crispy fried chicken fillet with mayo.'
    },
    {
        id: 28,
        categoryId: 3,
        name: 'Gourmet Beef Burger',
        price: 'Rs. 2200',
        rating: 5.0,
        image: 'https://i.pinimg.com/736x/c8/4a/33/c84a335905a212e0a36983b3ebfd8010.jpg',
        description: 'Premium beef patty with caramelized onions and swiss cheese.'
    },
    {
        id: 29,
        categoryId: 3,
        name: 'BBQ Pulled Chicken',
        price: 'Rs. 1800',
        rating: 4.7,
        image: 'https://i.pinimg.com/1200x/20/d4/97/20d49717566825cfcce611fa5bcb17bf.jpg',
        description: 'Slow cooked chicken in BBQ sauce on a brioche bun.'
    },
    {
        id: 30,
        categoryId: 3,
        name: 'Tower Burger',
        price: 'Rs. 2000',
        rating: 4.9,
        image: 'https://i.pinimg.com/736x/f1/fe/87/f1fe87fe4f42639a80a208a452965464.jpg',
        description: 'Chicken patty, hash brown, and cheese stacked high.'
    },

    // --- Category 4: Drinks ---
    {
        id: 31,
        categoryId: 4,
        name: 'Plain Tea (Kahata)',
        price: 'Rs. 100',
        rating: 4.5,
        image: 'https://i.pinimg.com/1200x/e6/5f/f8/e65ff8df439996c6a590a5c9fee0c4bb.jpg',
        description: 'Hot Sri Lankan black tea with ginger.'
    },
    {
        id: 32,
        categoryId: 4,
        name: 'Milk Tea',
        price: 'Rs. 150',
        rating: 4.8,
        image: 'https://i.pinimg.com/736x/94/98/b0/9498b0eff89bcb1a5dc94333771449f4.jpg',
        description: 'Creamy hot milk tea.'
    },
    {
        id: 33,
        categoryId: 4,
        name: 'Fresh Lime Juice',
        price: 'Rs. 300',
        rating: 4.6,
        image: 'https://i.pinimg.com/1200x/95/5a/13/955a13881ab9c428eb525e2dfc8dbf39.jpg',
        description: 'Refreshing lime juice with salt and sugar.'
    },
    {
        id: 34,
        categoryId: 4,
        name: 'Woodapple Juice',
        price: 'Rs. 400',
        rating: 4.7,
        image: 'https://i.pinimg.com/736x/b0/93/e8/b093e850b5c8bfb58ff0eaf0db48c5b1.jpg',
        description: 'Thick woodapple juice made with coconut milk.'
    },
    {
        id: 35,
        categoryId: 4,
        name: 'Ginger Beer (EGB)',
        price: 'Rs. 250',
        rating: 4.5,
        image: 'https://i.pinimg.com/1200x/8d/38/0b/8d380bcd3353751b5c659cd2815abd05.jpg',
        description: 'Chilled Elephant House Ginger Beer.'
    },
    {
        id: 36,
        categoryId: 4,
        name: 'Chocolate Milkshake',
        price: 'Rs. 950',
        rating: 4.9,
        image: 'https://i.pinimg.com/736x/ca/57/a0/ca57a06fff117a65d682652338581c26.jpg',
        description: 'Rich chocolate milkshake topped with whipped cream.'
    },
    {
        id: 37,
        categoryId: 4,
        name: 'Iced Latte',
        price: 'Rs. 1100',
        rating: 4.8,
        image: 'https://i.pinimg.com/1200x/aa/24/4d/aa244d511815dd1bb73d20781786b37e.jpg',
        description: 'Espresso with cold milk and vanilla syrup.'
    },
    {
        id: 38,
        categoryId: 4,
        name: 'Virgin Mojito',
        price: 'Rs. 1200',
        rating: 4.7,
        image: 'https://i.pinimg.com/736x/92/dd/15/92dd15772ad9b4e11260788ab631ff0a.jpg',
        description: 'Mint and lime mocktail with soda.'
    },
    {
        id: 39,
        categoryId: 4,
        name: 'Mango Smoothie',
        price: 'Rs. 1300',
        rating: 4.9,
        image: 'https://i.pinimg.com/1200x/16/cc/ae/16ccae5e181a1290356229f2f90e85af.jpg',
        description: 'Fresh mango blended with yogurt and honey.'
    },
    {
        id: 40,
        categoryId: 4,
        name: 'Blue Lagoon',
        price: 'Rs. 1150',
        rating: 4.6,
        image: 'https://i.pinimg.com/736x/e8/d8/ed/e8d8ed349a41db6ca57b06ac34ed58f6.jpg',
        description: 'Blue curaçao flavored refreshing mocktail.'
    },
];