// Import images - with correct file names from assets folder
import BeefBurger from './assets/BeefBurger.jpg';
import BeefSteak from './assets/BeefSteak.jpg';
import Cheesecake from './assets/Cheesecake.jpg';
import ChickenAlfredo from './assets/ChickenAlfredo.jpg';
import ChickenWings from './assets/ChickenWings.jpg';
import ChocolateCake from './assets/ChocolateCake.jpg';
import FreshOrangeJuice from './assets/FreshOrangeJuice.jpg';
import IceCreamSundae from './assets/IceCreamSundae.jpg';
import IcedCoffee from './assets/IcedCoffee.jpg';
import MargaritaPizza from './assets/MargheritaPizza.jpg';
import MozzarellaSticks from './assets/MozzarellaSticks.jpg';
import Salamon from './assets/Salamon.jpg';
import SpringRolls from './assets/SpringRolls.jpg';

const menuData = [
  // Appetizers
  {
    id: 1,
    name: "Spring Rolls",
    category: "Appetizers",
    price: 8.99,
    image: SpringRolls,
    description: "Crispy vegetable spring rolls with sweet chili sauce",
  },
  {
    id: 2,
    name: "Chicken Wings",
    category: "Appetizers",
    price: 10.99,
    image: ChickenWings,
    description: "Spicy buffalo wings with blue cheese dip",
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    category: "Appetizers",
    price: 9.99,
    image: MozzarellaSticks,
    description: "Golden fried mozzarella with marinara sauce",
  },

  // Main Courses
  {
    id: 4,
    name: "Grilled Salmon",
    category: "Main Courses",
    price: 24.99,
    image: Salamon,
    description: "Fresh Atlantic salmon with lemon butter sauce",
  },
  {
    id: 5,
    name: "Beef Burger",
    category: "Main Courses",
    price: 15.99,
    image: BeefBurger,
    description: "Angus beef burger with cheddar and bacon",
  },
  {
    id: 6,
    name: "Chicken Alfredo",
    category: "Main Courses",
    price: 18.99,
    image: ChickenAlfredo,
    description: "Creamy fettuccine with grilled chicken",
  },
  {
    id: 7,
    name: "Margherita Pizza",
    category: "Main Courses",
    price: 16.99,
    image: MargaritaPizza,
    description: "Classic pizza with fresh mozzarella and basil",
  },
  {
    id: 8,
    name: "Beef Steak",
    category: "Main Courses",
    price: 29.99,
    image: BeefSteak,
    description: "Prime ribeye steak with garlic butter",
  },

  // Desserts
  {
    id: 9,
    name: "Chocolate Cake",
    category: "Desserts",
    price: 7.99,
    image: ChocolateCake,
    description: "Rich chocolate cake with ganache",
  },
  {
    id: 10,
    name: "Cheesecake",
    category: "Desserts",
    price: 8.99,
    image: Cheesecake,
    description: "New York style cheesecake with berry compote",
  },
  {
    id: 11,
    name: "Ice Cream Sundae",
    category: "Desserts",
    price: 6.99,
    image: IceCreamSundae,
    description: "Vanilla ice cream with chocolate sauce and nuts",
  },

  // Drinks
  {
    id: 12,
    name: "Fresh Orange Juice",
    category: "Drinks",
    price: 4.99,
    image: FreshOrangeJuice,
    description: "Freshly squeezed orange juice",
  },
  {
    id: 13,
    name: "Iced Coffee",
    category: "Drinks",
    price: 1.99,
    image: IcedCoffee,
    description: "Cold brew coffee with milk",
  },
];

export default menuData;