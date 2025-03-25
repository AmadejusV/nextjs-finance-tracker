import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Link className="hover:text-gray-400" href="/">
            Finance data
          </Link>
          <Link className="hover:text-gray-400" href="/addNewExpense">
            Add new expense
          </Link>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Install
        </button>
      </nav>
    </header>
  );
};

export default Header;
