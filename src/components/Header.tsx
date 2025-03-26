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
      </nav>
    </header>
  );
};

export default Header;
