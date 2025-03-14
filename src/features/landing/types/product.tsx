export interface Product {
  name: string;
  price: string;
  description: string;
  imagePath: string;
  category: string;
}

export const Categories = [
  { id: "miles-creeps", name: "Miles Creeps" },
  { id: "cheesekuit", name: "Cheesekuit" },
  { id: "milk-bun", name: "Milk Bun" },
  { id: "mochi", name: "Mochi" },
  { id: "pudding", name: "Pudding" },
  { id: "birthday-cake", name: "Birthday Cake" }
];

  export const ProductData: Product[] = [
    // Miles Creeps
    {
      name: "Classic Red Velvet",
      price: "$42",
      description: "Rich and velvety smooth cake with cream cheese frosting",
      imagePath: "src/assets/image/products/miles-creeps-red-velvet.jpg",
      category: "miles-creeps"
    },
    {
      name: "Chocolate Dream",
      price: "$45",
      description: "Decadent chocolate layers with ganache filling",
      imagePath: "src/assets/image/products/miles-creeps-chocolate.jpg",
      category: "miles-creeps"
    },
    {
      name: "Strawberry Delight",
      price: "$38",
      description: "Light and fluffy cake with fresh strawberry filling",
      imagePath: "src/assets/image/products/miles-creeps-strawberry.jpg",
      category: "miles-creeps"
    },
    {
      name: "Matcha Green Tea",
      price: "$40",
      description: "Japanese-inspired matcha cake with white chocolate",
      imagePath: "src/assets/image/products/miles-creeps-matcha.jpg",
      category: "miles-creeps"
    },
    {
      name: "Tiramisu Crepe",
      price: "$43",
      description: "Coffee-flavored crepe cake with mascarpone cream",
      imagePath: "src/assets/image/products/miles-creeps-tiramisu.jpg",
      category: "miles-creeps"
    },
    // Cheesekuit
    {
      name: "Cheese Cheesekuit",
      price: "$35",
      description: "Classic baked cheesecake with graham cracker crust",
      imagePath: "src/assets/image/products/cheesekuit-cheese.jpg",
      category: "cheesekuit"
    },
    {
      name: "Chocolate Cheesekuit",
      price: "$38",
      description: "Creamy cheesecake loaded with Oreo cookies",
      imagePath: "src/assets/image/products/cheesekuit-chocolate.jpg",
      category: "cheesekuit"
    },
    {
      name: "Strawberry Cheesekuit",
      price: "$40",
      description: "Rich cheesecake topped with fresh blueberry compote",
      imagePath: "src/assets/image/products/cheesekuit-strawberry.jpg",
      category: "cheesekuit"
    },

    // Milk Bun
    {
      name: "Milk Bun Milkshake",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/milk-bun-susu.jpg",
      category: "milk-bun"
    },
    {
      name: "Milk Bun Chocolate",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/milk-bun-chocolate.jpg",
      category: "milk-bun"
    },
    {
      name: "Milk Bun Matcha",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/milk-bun-matcha.jpg",
      category: "milk-bun"
    },

    // Birthday Cake
    {
      name: "Birthday Cake Custome 1",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/birthday-cake-1.png",
      category: "birthday-cake"
    },
    {
      name: "Birthday Cake Custome 2",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/birthday-cake-2.png",
      category: "birthday-cake"
    },
    {
      name: "Birthday Cake Custome 3",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/birthday-cake-3.png",
      category: "birthday-cake"
    },
    {
      name: "Birthday Cake Custome 4",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/birthday-cake-4.png",
      category: "birthday-cake"
    },
    {
      name: "Birthday Cake Custome 5",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/birthday-cake-5.png",
      category: "birthday-cake"
    },
    {
      name: "Birthday Cake Custome 6",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/birthday-cake-6.png",
      category: "birthday-cake"
    },
    {
      name: "Birthday Cake Custome 7",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/birthday-cake-7.png",
      category: "birthday-cake"
    },
    {
      name: "Birthday Cake Custome 8",
      price: "$35",
      description: "Classic milkshake with graham cracker crust",
      imagePath: "src/assets/image/products/birthday-cake-8.png",  
      category: "birthday-cake"
    }
  ];