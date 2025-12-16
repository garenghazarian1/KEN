/**
 * Drinks Menu Data
 *
 * Centralized drinks menu information for Ken Beauty Salon.
 * This is the single source of truth for all drinks offered.
 */

export const drinksMenu = {
  hotDrinks: [
    "American Coffee with Milk",
    "American Coffee",
    "Black Tea",
    "Butter Cookies",
    "Caffe Latte",
    "Cappuccino",
    "Espresso",
    "Green Tea",
    "Hot chocolate with Milk",
    "Hot chocolate",
    "Karak Tea",
    "Mocha",
    "Turkish coffee",
  ],
  coldDrinks: [
    "Mojito Mint",
    "Mojito Passion Fruits",
    "Mojito strawberry",
    "Orange Juice",
    "Ice Coffee",
    "Water",
    "Blue-spark",
  ],
  addOns: ["Marshmallow", "Butter Cookies"],
};

// Helper function to get image path from drink name
const getDrinkImagePath = (drinkName) => {
  // Map drink names to actual file names in /public/drinks/
  const imageMap = {
    "American Coffee with Milk": "/drinks/American-Coffee-with-Milk.jpeg",
    "American Coffee": "/drinks/American-Coffee.jpeg",
    "Black Tea": "/drinks/Black-Tea.jpeg",
    "Butter Cookies": "/drinks/Butter-Cookies.jpeg",
    "Caffe Latte": "/drinks/Caffe-Latte.jpeg",
    Cappuccino: "/drinks/Cappuccino.jpeg",
    Espresso: "/drinks/Espresso.jpeg",
    "Green Tea": "/drinks/Green-tea.jpeg",
    "Hot chocolate with Milk": "/drinks/Hot-chocolate-with-Milk.jpeg",
    "Hot chocolate": "/drinks/Hot-chocolate.jpeg",
    "Karak Tea": "/drinks/Karak-Tea.jpeg",
    Mocha: "/drinks/Mocha.jpeg",
    "Turkish coffee": "/drinks/Turkish-coffee.jpeg",
    "Mojito Mint": "/drinks/Mojito-Mint.jpeg",
    "Mojito Passion Fruits": "/drinks/Mojito-Passion-Fruits.jpeg",
    "Mojito strawberry": "/drinks/Mojito-strawberry.jpeg",
    "Orange Juice": "/drinks/Orange-Juice.jpeg",
    "Ice Coffee": "/drinks/Ice-Coffee.jpeg",
    Water: "/drinks/Water.jpeg",
    "Blue-spark": "/drinks/Blue-spark.jpeg",
    Marshmallow: "/drinks/Marshmallow.jpeg",
  };

  return imageMap[drinkName] || null;
};

// Helper function to create drink objects with image paths
const createDrinkItems = (drinks) => {
  return drinks.map((drink) => ({
    name: drink,
    image: getDrinkImagePath(drink),
  }));
};

export const drinksCategories = [
  {
    id: "hot",
    title: "HOT DRINKS",
    drinks: createDrinkItems(drinksMenu.hotDrinks),
    icon: "☕",
  },
  {
    id: "cold",
    title: "COLD DRINKS",
    drinks: createDrinkItems(drinksMenu.coldDrinks),
    icon: "🧊",
  },
  {
    id: "addons",
    title: "ADD-ONS",
    drinks: createDrinkItems(drinksMenu.addOns),
    icon: "➕",
  },
];
